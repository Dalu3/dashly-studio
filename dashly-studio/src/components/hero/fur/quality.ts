export type FurQualityName =
    | "high"
    | "balanced"
    | "tablet"
    | "mobile"
    | "mobile-low";

export interface FurQualityPreset {
    name: FurQualityName;
    density: number;
    maxDpr: number;
    maxPhysicalPixels: number;
    idleFps: number;
}

const DPR_STEPS = [2, 1.75, 1.5, 1.25, 1] as const;

export const FUR_QUALITY: Record<FurQualityName, FurQualityPreset> = {
    // The restored, larger desktop wordmark exposes more canvas area. Raising
    // instance density (rather than ribbon width) restores a full coat while
    // preserving fine tapered tips and the existing shader silhouette.
    high: {
        name: "high",
        density: 4.8e6,
        maxDpr: 2,
        maxPhysicalPixels: 6e6,
        idleFps: 30,
    },
    // Laptop viewports render the word at a smaller projected size, so a
    // modest density reduction removes geometry that contributes least to the
    // final pixels. Keep this close to high: changing strand width/length to
    // mask a larger cut made the coat visibly thinner in earlier comparisons.
    balanced: {
        name: "balanced",
        density: 4.35e6,
        maxDpr: 2,
        maxPhysicalPixels: 4.5e6,
        idleFps: 30,
    },
    // Tablet gets a real geometry budget instead of desktop density. The cut
    // remains deliberately below 20%, while the existing front/silhouette
    // weighted sampler keeps the saved roots concentrated on back-facing,
    // low-visibility surface rather than exposing the support mesh.
    tablet: {
        name: "tablet",
        density: 4e6,
        maxDpr: 2,
        maxPhysicalPixels: 3.5e6,
        idleFps: 24,
    },
    mobile: {
        name: "mobile",
        density: 2.4e6,
        maxDpr: 2,
        maxPhysicalPixels: 2.5e6,
        idleFps: 20,
    },
    // This retains the former, visually-approved mobile strand density. DPR is
    // kept at 2 because thin sub-pixel fibres become visibly soft at 1.25–1.5
    // DPR on modern mobile displays; geometry is the safer budget to reduce.
    "mobile-low": {
        name: "mobile-low",
        density: 1.9e6,
        maxDpr: 2,
        maxPhysicalPixels: 1.75e6,
        idleFps: 15,
    },
};

/**
 * Selects the sharpest supported DPR that stays inside the profile's total
 * framebuffer budget. Quantised steps avoid tiny resize-driven DPR changes
 * and make each visual level straightforward to reproduce in testing.
 */
export function resolveFurPixelRatio(
    canvasWidth: number,
    canvasHeight: number,
    devicePixelRatio: number,
    quality: FurQualityPreset,
): number {
    const cssPixels = Math.max(1, canvasWidth) * Math.max(1, canvasHeight);
    const dprCeiling = Math.min(devicePixelRatio, quality.maxDpr);

    for (const dpr of DPR_STEPS) {
        if (
            dpr <= dprCeiling &&
            cssPixels * dpr * dpr <= quality.maxPhysicalPixels
        ) {
            return dpr;
        }
    }

    // DPR 1 is the final quality floor. Exceptionally large canvases can
    // exceed a profile budget even there; lowering below native resolution
    // would blur the fine fur more than the extra saving is worth.
    return Math.min(dprCeiling, 1);
}

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

    if (reducedMotion || viewportWidth <= 360) {
        return FUR_QUALITY["mobile-low"];
    }

    if (viewportWidth <= 640) {
        return FUR_QUALITY.mobile;
    }

    if (viewportWidth <= 900) {
        return FUR_QUALITY.tablet;
    }

    if (viewportWidth < 1280) {
        return FUR_QUALITY.balanced;
    }

    return FUR_QUALITY.high;
}
