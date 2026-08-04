/**
 * One shared `requestAnimationFrame` chain for the whole fur system, instead
 * of cursorInteraction.ts and idleAnimation.ts each running their own. Both
 * used to independently call `requestAnimationFrame` — harmless in isolation,
 * but while the cursor is actively settling AND idle sway is running (the
 * common case: idle sway is "whenever visible", cursor settling is "whenever
 * something just moved"), both loops are live at once and each calls
 * render() on its own tick, landing two render() calls in the same real
 * frame more often than not. Only the second one's output is ever seen, so
 * the first was pure waste. A single shared driver makes that structurally
 * impossible: exactly one `requestAnimationFrame` registration exists at any
 * time for this whole system, regardless of how many independent "reasons to
 * keep animating" are active.
 */

export interface FrameTickResult {
    keepRunning: boolean;
    needsRender: boolean;
}

type FrameTick = (now: number) => boolean | FrameTickResult;

export interface FrameLoopHandle {
    /** Registers `tick`, starting the shared rAF chain if it isn't already
     *  running. `tick` is called at most once per real frame and can return a
     *  keep-running/render pair so the scene is drawn once after all ticks. */
    request: (tick: FrameTick) => void;
    /** Removes `tick` immediately, without waiting for it to return false. */
    cancel: (tick: FrameTick) => void;
    dispose: () => void;
}

export function createFrameLoop(render: () => void): FrameLoopHandle {
    const ticks = new Set<FrameTick>();
    let frameId = 0;
    let running = false;
    let disposed = false;

    const loop = (now: number) => {
        if (disposed) {
            running = false;

            return;
        }

        // Snapshot first: a tick's own callback can register or cancel
        // OTHER ticks (cursorInteraction and idleAnimation are independent
        // consumers of this one loop), which must not mutate `ticks` while
        // this very iteration is still reading it.
        let needsRender = false;

        for (const tick of Array.from(ticks)) {
            const result = tick(now);
            const keepRunning =
                typeof result === "boolean" ? result : result.keepRunning;

            needsRender ||=
                typeof result === "boolean" ? true : result.needsRender;

            if (!keepRunning) {
                ticks.delete(tick);
            }
        }

        if (needsRender) {
            render();
        }

        if (ticks.size > 0) {
            frameId = requestAnimationFrame(loop);
        } else {
            running = false;
        }
    };

    return {
        request: (tick) => {
            ticks.add(tick);

            if (!running && !disposed) {
                running = true;
                frameId = requestAnimationFrame(loop);
            }
        },
        cancel: (tick) => {
            ticks.delete(tick);
        },
        dispose: () => {
            disposed = true;
            ticks.clear();
            cancelAnimationFrame(frameId);
            running = false;
        },
    };
}
