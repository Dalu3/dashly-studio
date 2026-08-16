import { useCallback } from "react";

import styles from "./HeroBackground.module.css";

const VIDEO_PLAYBACK_RATE = 0.8;

/**
 * Lightweight looping Hero backdrop. The fur/WebGL scene and foreground
 * content stay outside this component so they can keep their own lifecycle.
 */
export interface HeroBackgroundProps {
    staticOnly?: boolean;
}

export function HeroBackground({ staticOnly = false }: HeroBackgroundProps) {
    const setPlaybackRate = useCallback((video: HTMLVideoElement | null) => {
        if (video) {
            video.playbackRate = VIDEO_PLAYBACK_RATE;
        }
    }, []);

    return (
        <div className={styles.root} aria-hidden="true">
            {staticOnly ? (
                <img
                    className={styles.poster}
                    src="/videos/hero-background-poster.webp"
                    alt=""
                    width="1920"
                    height="1080"
                />
            ) : (
                <video
                    className={styles.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    width="1920"
                    height="1080"
                    poster="/videos/hero-background-poster.webp"
                    ref={setPlaybackRate}
                >
                    <source
                        media="(max-width: 47.999rem)"
                        src="/videos/hero-background-loop-mobile.webm"
                        type="video/webm"
                    />
                    <source
                        src="/videos/hero-background-loop.webm"
                        type="video/webm"
                    />
                    <source src="/videos/hero-background-loop.mp4" type="video/mp4" />
                </video>
            )}
        </div>
    );
}
