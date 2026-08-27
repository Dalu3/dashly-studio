import { useEffect, useRef } from "react";

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
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || staticOnly) {
            return undefined;
        }

        let disposed = false;
        let playRequest: Promise<void> | null = null;
        let resumeAfterRequest = false;
        let resumeFrame = 0;

        // Set the media properties before every explicit play request. Safari
        // can restore a video element from BFCache with its playback state
        // suspended even though the corresponding JSX attributes are intact.
        video.muted = true;
        video.defaultMuted = true;
        video.playbackRate = VIDEO_PLAYBACK_RATE;

        const requestPlayback = () => {
            if (disposed || document.hidden || !video.paused || video.error) {
                return;
            }

            if (playRequest) {
                // Preserve one lifecycle-triggered resume that arrived while
                // the browser was still settling the previous play request.
                resumeAfterRequest = true;
                return;
            }

            video.muted = true;
            const request = video.play();
            playRequest = request;

            void request
                .catch(() => {
                    // A rejected autoplay request is not retried in a timer
                    // loop. The next real media/page lifecycle boundary below
                    // gets one fresh attempt when the browser is ready again.
                })
                .finally(() => {
                    if (playRequest === request) {
                        playRequest = null;
                    }

                    if (resumeAfterRequest) {
                        resumeAfterRequest = false;
                        schedulePlayback();
                    }
                });
        };

        const schedulePlayback = () => {
            if (disposed || document.hidden || resumeFrame) {
                return;
            }

            resumeFrame = window.requestAnimationFrame(() => {
                resumeFrame = 0;
                requestPlayback();
            });
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                schedulePlayback();
            }
        };
        const handlePageShow = () => schedulePlayback();
        const handleMediaReady = () => schedulePlayback();
        const handleUnexpectedPause = () => {
            if (!video.ended) {
                schedulePlayback();
            }
        };

        video.addEventListener("canplay", handleMediaReady);
        video.addEventListener("loadeddata", handleMediaReady);
        video.addEventListener("pause", handleUnexpectedPause);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pageshow", handlePageShow);

        schedulePlayback();

        return () => {
            disposed = true;
            window.cancelAnimationFrame(resumeFrame);
            video.removeEventListener("canplay", handleMediaReady);
            video.removeEventListener("loadeddata", handleMediaReady);
            video.removeEventListener("pause", handleUnexpectedPause);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [staticOnly]);

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
                    preload="auto"
                    width="1920"
                    height="1080"
                    poster="/videos/hero-background-poster.webp"
                    ref={videoRef}
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
