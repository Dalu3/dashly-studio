import { BufferAttribute, BufferGeometry } from "three";

import type { HelloMeshSource } from "./preloadHello";
import type { StrandAttributeData } from "./createStrands";
import type {
    FurIndexArray,
    FurWorkerRequest,
    FurWorkerResponse,
    WorkerPreparedFur,
    WorkerSourceGeometry,
} from "./furWorkerProtocol";

export interface PreparedFurData {
    geometry: BufferGeometry;
    strands: StrandAttributeData;
}

export interface FurDataWorkerHandle {
    generate: (
        sources: readonly HelloMeshSource[],
        density: number,
        strokeRadius: number,
    ) => Promise<PreparedFurData[]>;
    dispose: () => void;
}

export function createFurDataWorker(): FurDataWorkerHandle {
    const worker = new Worker(new URL("./furGeneration.worker.ts", import.meta.url), {
        type: "module",
    });
    const pending = new Map<
        number,
        {
            resolve: (meshes: PreparedFurData[]) => void;
            reject: (reason: Error) => void;
        }
    >();
    let nextId = 1;
    let disposed = false;
    let failed = false;

    const rejectAll = (error: Error) => {
        for (const request of pending.values()) {
            request.reject(error);
        }
        pending.clear();
    };

    worker.onmessage = (event: MessageEvent<FurWorkerResponse>) => {
        const response = event.data;
        const request = pending.get(response.id);
        if (!request) return;
        pending.delete(response.id);

        if (!response.ok) {
            request.reject(new Error(response.message));
            return;
        }

        request.resolve(response.meshes.map(hydratePreparedFur));
    };
    worker.onerror = () => {
        failed = true;
        rejectAll(new Error("fur generation worker failed"));
    };

    return {
        generate: (sources, density, strokeRadius) => {
            if (disposed || failed) {
                return Promise.reject(new Error("fur generation worker is disposed"));
            }

            const id = nextId++;
            const transfer: Transferable[] = [];
            const geometries: WorkerSourceGeometry[] = sources.map((source) => {
                const sourcePosition = source.geometry.getAttribute("position");
                const position = new Float32Array(sourcePosition.array);
                const sourceIndex = source.geometry.getIndex()?.array;
                const index: FurIndexArray = sourceIndex instanceof Uint16Array
                    ? new Uint16Array(sourceIndex)
                    : sourceIndex instanceof Uint32Array
                      ? new Uint32Array(sourceIndex)
                      : Uint32Array.from(
                            { length: sourcePosition.count },
                            (_, vertex) => vertex,
                        );
                transfer.push(position.buffer, index.buffer);
                return { position, index };
            });

            const request: FurWorkerRequest = {
                id,
                density,
                strokeRadius,
                geometries,
            };
            const promise = new Promise<PreparedFurData[]>((resolve, reject) => {
                pending.set(id, { resolve, reject });
            });
            worker.postMessage(request, transfer);
            return promise;
        },
        dispose: () => {
            if (disposed) return;
            disposed = true;
            worker.terminate();
            rejectAll(new Error("fur generation worker disposed"));
        },
    };
}

function hydratePreparedFur(mesh: WorkerPreparedFur): PreparedFurData {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(mesh.geometry.position, 3));
    geometry.setAttribute("normal", new BufferAttribute(mesh.geometry.normal, 3));
    geometry.setIndex(new BufferAttribute(mesh.geometry.index, 1));
    return { geometry, strands: mesh.strands };
}
