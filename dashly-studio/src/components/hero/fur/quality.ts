export type FurQualityName =
    | "high"
    | "balanced"
    | "tablet"
    | "mobile"
    | "mobile-low";

/** Widths at or below this use the mobile rasterisation budget: a 1.5 DPR
 *  cap, no MSAA and a half-size shadow map. Shared with HelloModel so the
 *  context attributes it must choose before any layout pass agree with the
 *  preset `resolveFurQuality` will pick afterwards. */
export const MOBILE_QUALITY_MAX_WIDTH = 640;

export interface FurQualityPreset {
    name: FurQualityName;
    density: number;
    maxDpr: number;
    maxPhysicalPixels: number;
    idleFps: number;
    strokeRadius: number;
    strandLength: number;
    strandWidth: number;
    minStrandPixels: number;
    shadeContrast: number;
    shellCount: number;
    shellLength: number;
    detailStrandFraction: number;
    silhouetteStrandFraction: number;
    silhouetteNormalThreshold: number;
}

const DPR_STEPS = [2, 1.875, 1.75, 1.5, 1.25, 1] as const;

export const FUR_QUALITY: Record<FurQualityName, FurQualityPreset> = {
    // Desktop retains the finest fibres. Its density is slightly below the
    // previous pass; the unchanged support radius means this is a direct
    // geometry saving rather than a visual-size change.
    high: {
        name: "high",
        density: 4.6e6,
        maxDpr: 2,
        maxPhysicalPixels: 6e6,
        idleFps: 30,
        strokeRadius: 0.0085,
        strandLength: 0.0078,
        strandWidth: 0.0009,
        minStrandPixels: 0.7,
        shadeContrast: 1,
        shellCount: 0,
        shellLength: 0,
        detailStrandFraction: 1,
        silhouetteStrandFraction: 0,
        silhouetteNormalThreshold: 0,
    },
    // As the projected word gets smaller, make each tapered ribbon marginally
    // fuller before removing instances. This preserves overlap and edge detail
    // without changing the word's layout scale.
    balanced: {
        name: "balanced",
        density: 4.15e6,
        maxDpr: 1.875,
        maxPhysicalPixels: 4.5e6,
        idleFps: 30,
        strokeRadius: 0.00855,
        strandLength: 0.0079,
        strandWidth: 0.00094,
        minStrandPixels: 0.85,
        shadeContrast: 0.8,
        shellCount: 0,
        shellLength: 0,
        detailStrandFraction: 1,
        silhouetteStrandFraction: 0,
        silhouetteNormalThreshold: 0,
    },
    // Tablet adds a little support mass and pile reach. The radius remains
    // below the measured 0.009 threshold where the e/loops begin to close.
    tablet: {
        name: "tablet",
        density: 3.75e6,
        maxDpr: 2,
        maxPhysicalPixels: 3.5e6,
        idleFps: 24,
        strokeRadius: 0.00865,
        strandLength: 0.0081,
        strandWidth: 0.00098,
        minStrandPixels: 0.88,
        shadeContrast: 0.72,
        shellCount: 0,
        shellLength: 0,
        detailStrandFraction: 1,
        silhouetteStrandFraction: 0,
        silhouetteNormalThreshold: 0.38,
    },
    mobile: {
        name: "mobile",
        density: 3e6,
        maxDpr: 1.5,
        maxPhysicalPixels: 2.5e6,
        idleFps: 20,
        strokeRadius: 0.00875,
        strandLength: 0.00835,
        strandWidth: 0.00102,
        minStrandPixels: 0.92,
        shadeContrast: 0.68,
        shellCount: 0,
        shellLength: 0,
        detailStrandFraction: 1,
        silhouetteStrandFraction: 0,
        silhouetteNormalThreshold: 0.4,
    },
    // Reduced-motion and narrow mobile screens use the fewest instances, so
    // width, length and a 3.5% fuller support stroke carry the silhouette.
    "mobile-low": {
        name: "mobile-low",
        density: 2.3e6,
        maxDpr: 1.5,
        maxPhysicalPixels: 1.75e6,
        idleFps: 15,
        strokeRadius: 0.0088,
        strandLength: 0.00855,
        strandWidth: 0.00106,
        minStrandPixels: 0.98,
        shadeContrast: 0.62,
        shellCount: 0,
        shellLength: 0,
        detailStrandFraction: 1,
        silhouetteStrandFraction: 0,
        silhouetteNormalThreshold: 0.42,
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
    // Never ask for more physical pixels than the device itself reports. An
    // earlier `minDpr` floor raised DPR to 2 on small canvases to keep
    // DevTools emulation sharp, which also forced a 1.31-Mpixel framebuffer
    // onto real phones and onto GPU-less audit runners, where it is the
    // single largest cost in the scene.
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

    if (viewportWidth <= MOBILE_QUALITY_MAX_WIDTH) {
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
