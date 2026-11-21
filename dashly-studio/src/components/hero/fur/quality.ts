export type FurQualityName =
    | "high"
    | "balanced"
    | "tablet"
    | "mobile"
    | "mobile-coarse"
    | "mobile-low";

/** Widths at or below this get the mobile rasterisation budget: a half-size
 *  shadow map, and a profile from the mobile family below. Multisampling is
 *  no longer decided here — it is a property of the preset, so that
 *  `?furQuality=` can change it on a real device. Shared with HelloModel so
 *  the context attributes it must choose before any layout pass agree with
 *  the preset `resolveFurQuality` will pick afterwards. */
export const MOBILE_QUALITY_MAX_WIDTH = 640;

export interface FurQualityPreset {
    name: FurQualityName;
    density: number;
    /**
     * Multisampling for the whole scene. Strands are real, fully opaque
     * geometry with no alpha coverage (see fur/shaders/strand.frag), so
     * nothing else softens their edges: without MSAA every hair resolves to
     * hard-edged fragments and a coat of them reads as speckle rather than
     * fur. That is the single biggest difference between how the word looks
     * on a desktop and how it looked on a phone, and it is a property of the
     * profile rather than of the viewport so that `?furQuality=` can switch
     * it on a real device.
     */
    msaa: boolean;
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

// iPhones report a device pixel ratio of 3. Capping the ladder at 2 meant the
// fur was rasterised at two thirds of the screen's resolution and then
// upscaled by the compositor, and strands are sub-pixel structures: the
// upscale turns them into the crawling grain the phone was showing. The steps
// above 2 exist so the renderer can meet such a screen natively; each
// profile's own `maxDpr` and pixel budget still decide how far up it goes.
const DPR_STEPS = [3, 2.75, 2.5, 2.25, 2, 1.875, 1.75, 1.5, 1.25, 1] as const;

export const FUR_QUALITY: Record<FurQualityName, FurQualityPreset> = {
    // Desktop retains the finest fibres. Its density is slightly below the
    // previous pass; the unchanged support radius means this is a direct
    // geometry saving rather than a visual-size change.
    high: {
        name: "high",
        density: 4.6e6,
        msaa: true,
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
        msaa: true,
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
        msaa: true,
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
    // The 1.5 DPR cap this preset used to carry was never seen on a real
    // phone: the capability gate dropped HELLO on every iPhone (WebKit
    // clamps hardwareConcurrency — see Hero.tsx), so the budget was only
    // ever judged in DevTools emulation. On a 3x screen it renders the fur
    // at half resolution and lets the compositor upscale, and strands are
    // sub-pixel structures: what arrives is not softer fur but crawling
    // grain, which is what the idle animation then appears to shimmer.
    // A 2 cap has the same fault on a 3x screen, only less of it, so this
    // profile now asks for the panel's own resolution: ~3.0 Mpixels on a
    // 390pt phone and ~3.8 on the largest, both inside the budget below,
    // which still steps the DPR down on a canvas past it.
    mobile: {
        name: "mobile",
        density: 3.5e6,
        msaa: true,
        maxDpr: 3,
        maxPhysicalPixels: 4.2e6,
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
    // A phone draws the word about a third of the width a desktop does, so
    // the profile above puts several hairs on every pixel: past about one
    // strand per pixel the extra ones stop being detail, because each is a
    // different brightness and none is resolvable. This profile does what
    // level of detail normally does — fewer strands, each wide enough to
    // rasterise cleanly, with width and length carrying the coverage the
    // instances gave up. Reachable as `?furQuality=mobile-coarse` so the
    // dense-against-resolved comparison can be made on a real phone rather
    // than in emulation, which cannot reproduce a 3x panel.
    "mobile-coarse": {
        name: "mobile-coarse",
        density: 2.2e6,
        msaa: true,
        maxDpr: 3,
        maxPhysicalPixels: 4.2e6,
        idleFps: 20,
        strokeRadius: 0.00875,
        strandLength: 0.0088,
        strandWidth: 0.0016,
        minStrandPixels: 1.05,
        shadeContrast: 0.74,
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
        // Multisampling stays on here too. This tier is reached by the
        // narrowest phones, which are exactly where hard-edged strands read
        // worst; the instance count below is what carries the saving.
        msaa: true,
        // Same reasoning as `mobile`: the instance count carries the saving
        // here, and undersampling only trades it for grain.
        maxDpr: 2.5,
        maxPhysicalPixels: 2.6e6,
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
