import { useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import styles from "./HeroBackground.module.css";

const VIDEO_PLAYBACK_RATE = 0.8;
const MOBILE_BACKGROUND_QUERY = "(max-width: 47.999rem)";

function isAppleSafari(): boolean {
    return navigator.vendor === "Apple Computer, Inc.";
}

/**
 * Lightweight looping Hero backdrop. The fur/WebGL scene and foreground
 * content stay outside this component so they can keep their own lifecycle.
 */
export interface HeroBackgroundProps {
    staticOnly?: boolean;
}

export function HeroBackground({ staticOnly = false }: HeroBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [autoplayDenied, setAutoplayDenied] = useState(false);
    const isMobileBackground = useMediaQuery(MOBILE_BACKGROUND_QUERY);

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
                .catch((error: unknown) => {
                    // A rejected autoplay request is not retried in a timer
                    // loop. The next real media/page lifecycle boundary below
                    // gets one fresh attempt when the browser is ready again.
                    if (
                        !disposed &&
                        error instanceof DOMException &&
                        error.name === "NotAllowedError"
                    ) {
                        // WebKit can deny even muted HTML media autoplay at
                        // the platform level. Safari also supports H.264 MP4
                        // as an animated image resource, which is outside the
                        // HTMLMediaElement autoplay policy. Keep other
                        // browsers on their normal video lifecycle.
                        if (isAppleSafari()) {
                            setAutoplayDenied(true);
                        }
                    }
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
    }, [staticOnly, autoplayDenied]);

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
            ) : autoplayDenied ? (
                <img
                    className={styles.poster}
                    src={
                        isMobileBackground
                            ? "/videos/hero-background-loop-mobile.mp4"
                            : "/videos/hero-background-loop.mp4"
                    }
                    alt=""
                    width={isMobileBackground ? "1280" : "1920"}
                    height={isMobileBackground ? "720" : "1080"}
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
