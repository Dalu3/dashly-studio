import type { StrandAttributeData } from "./createStrands";

export type FurIndexArray = Uint16Array | Uint32Array;

export interface WorkerSourceGeometry {
    position: Float32Array;
    index: FurIndexArray;
}

export interface WorkerPreparedGeometry {
    position: Float32Array;
    normal: Float32Array;
    index: FurIndexArray;
}

export interface FurWorkerRequest {
    id: number;
    density: number;
    strokeRadius: number;
    geometries: WorkerSourceGeometry[];
}

export interface WorkerPreparedFur {
    geometry: WorkerPreparedGeometry;
    strands: StrandAttributeData;
}

export type FurWorkerResponse =
    | { id: number; ok: true; meshes: WorkerPreparedFur[] }
    | { id: number; ok: false; message: string };
