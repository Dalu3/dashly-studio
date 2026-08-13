/// <reference lib="webworker" />

import { BufferAttribute, BufferGeometry } from "three";

import {
    generateStrandAttributes,
    strandCountFor,
    type StrandAttributeData,
} from "./createStrands";
import type {
    FurIndexArray,
    FurWorkerRequest,
    FurWorkerResponse,
    WorkerPreparedFur,
} from "./furWorkerProtocol";
import { prepareGeometry } from "./prepareGeometry";

const workerScope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

const transferStrands = (
    strands: StrandAttributeData,
    transfer: Transferable[],
) => {
    transfer.push(
        strands.roots.buffer,
        strands.normals.buffer,
        strands.growth.buffer,
        strands.curl.buffer,
        strands.idle.buffer,
        strands.params.buffer,
        strands.shade.buffer,
    );
};

workerScope.onmessage = (event: MessageEvent<FurWorkerRequest>) => {
    const { id, density, geometries } = event.data;

    try {
        const transfer: Transferable[] = [];
        const meshes: WorkerPreparedFur[] = geometries.map((serialized) => {
            const source = new BufferGeometry();
            source.setAttribute("position", new BufferAttribute(serialized.position, 3));
            source.setIndex(new BufferAttribute(serialized.index, 1));

            const prepared = prepareGeometry(source);
            const count = strandCountFor(prepared, density);
            const strands = generateStrandAttributes(prepared, count);
            const position = prepared.getAttribute("position").array as Float32Array;
            const normal = prepared.getAttribute("normal").array as Float32Array;
            const preparedIndex = prepared.getIndex()?.array as FurIndexArray | undefined;

            if (!preparedIndex) {
                throw new Error("prepared fur geometry is not indexed");
            }

            transfer.push(position.buffer, normal.buffer, preparedIndex.buffer);
            transferStrands(strands, transfer);
            source.dispose();

            return {
                geometry: { position, normal, index: preparedIndex },
                strands,
            };
        });

        const response: FurWorkerResponse = { id, ok: true, meshes };
        workerScope.postMessage(response, transfer);
    } catch (error) {
        const response: FurWorkerResponse = {
            id,
            ok: false,
            message: error instanceof Error ? error.message : String(error),
        };
        workerScope.postMessage(response);
    }
};
