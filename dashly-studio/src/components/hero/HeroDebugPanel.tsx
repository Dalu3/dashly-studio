import { useEffect, useRef } from "react";

import { getScrollSource, type ParallaxDebug } from "@/hooks/useHeroParallax";

/**
 * TEMPORARY diagnostic overlay. Delete this file and its usage in Hero.tsx
 * once the motion is confirmed working.
 *
 * Writes straight to DOM nodes via refs on every frame — no React state, so it
 * cannot itself perturb the thing it is measuring.
 */
export function HeroDebugPanel({
    sampleRef,
}: {
    sampleRef: { current: ParallaxDebug | null };
}) {
    const boxRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        let frameId = 0;
        const startedAt = performance.now();

        const read = (selector: string) => {
            const el = document.querySelector(selector);

            if (!el) {
                return "MISSING";
            }

            const t = getComputedStyle(el).transform;

            if (t === "none") {
                return "none";
            }

            const m = new DOMMatrix(t);

            return `x=${m.e.toFixed(1)} y=${m.f.toFixed(1)}`;
        };

        const tick = () => {
            const box = boxRef.current;

            if (box) {
                const s = sampleRef.current;
                const scroller = getScrollSource();
                const streak = document.querySelector('[class*="_streakA_"]');
                const anim = streak
                    ? getComputedStyle(streak).animationName
                    : "n/a";

                box.textContent = [
                    `elapsed        ${((performance.now() - startedAt) / 1000).toFixed(1)}s`,
                    `reducedMotion  ${matchMedia("(prefers-reduced-motion: reduce)").matches}`,
                    `scrollSource   ${scroller.tagName.toLowerCase()} top=${Math.round(scroller.scrollTop)}`,
                    `rawProgress    ${s ? s.rawProgress.toFixed(4) : "—"}`,
                    `easedProgress  ${s ? s.easedProgress.toFixed(4) : "—"}`,
                    `rafFPS         ${s ? s.fps.toFixed(1) : "—"}   frames ${s ? s.frames : "—"}`,
                    `animationName  ${anim}`,
                    `IDLE streakA   ${read('[class*="_streakA_"]')}`,
                    `IDLE streakD   ${read('[class*="_streakD_"]')}`,
                    `PAR  streakA   ${read('[class*="_parallax_"]:nth-of-type(3)')}`,
                    `PAR  sheen     ${read('[class*="_parallax_"]:nth-of-type(7)')}`,
                ].join("\n");
            }

            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frameId);
    }, [sampleRef]);

    return (
        <pre
            ref={boxRef}
            style={{
                position: "fixed",
                top: "8px",
                left: "8px",
                zIndex: 99999,
                margin: 0,
                padding: "10px 12px",
                font: "11px/1.45 ui-monospace, Menlo, monospace",
                color: "#0b1e2d",
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: "8px",
                pointerEvents: "none",
                whiteSpace: "pre",
            }}
        />
    );
}
