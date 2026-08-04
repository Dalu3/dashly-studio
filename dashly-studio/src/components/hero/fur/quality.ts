export type FurQualityName = "high" | "balanced" | "mobile";

export interface FurQualityPreset {
    name: FurQualityName;
    density: number;
    maxDpr: number;
    idleFps: number;
}

export const FUR_QUALITY: Record<FurQualityName, FurQualityPreset> = {
    high: { name: "high", density: 4.6e6, maxDpr: 2, idleFps: 30 },
    balanced: { name: "balanced", density: 4.6e6, maxDpr: 2, idleFps: 30 },
    mobile: { name: "mobile", density: 1.9e6, maxDpr: 1.25, idleFps: 20 },
};

export function resolveFurQuality(
    viewportWidth: number,
    reducedMotion: boolean,
): FurQualityPreset {
    if (typeof window !== "undefined") {
        const requested = new URLSearchParams(window.location.search).get(
            "furQuality",
        ) as FurQualityName | null;

        if (requested && requested in FUR_QUALITY) {
            return FUR_QUALITY[requested];
        }
    }

    if (viewportWidth <= 640 || reducedMotion) {
        return FUR_QUALITY.mobile;
    }

    return FUR_QUALITY.balanced;
}
