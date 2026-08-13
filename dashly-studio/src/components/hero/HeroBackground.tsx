import { useCallback } from "react";

import styles from "./HeroBackground.module.css";

const VIDEO_PLAYBACK_RATE = 0.8;

/**
 * Lightweight looping Hero backdrop. The fur/WebGL scene and foreground
 * content stay outside this component so they can keep their own lifecycle.
 */
export function HeroBackground() {
    const setPlaybackRate = useCallback((video: HTMLVideoElement | null) => {
        if (video) {
            video.playbackRate = VIDEO_PLAYBACK_RATE;
        }
    }, []);

    return (
        <div className={styles.root} aria-hidden="true">
            <video
                className={styles.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/videos/hero-background-poster.webp"
                ref={setPlaybackRate}
            >
                <source src="/videos/hero-background-loop.webm" type="video/webm" />
                <source src="/videos/hero-background-loop.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
