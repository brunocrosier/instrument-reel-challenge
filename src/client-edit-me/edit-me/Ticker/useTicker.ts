import { useCallback, useRef } from "react";

export function useTicker() {
    const contentRef = useRef<HTMLDivElement>(null);

    const onMouseEnter = useCallback(() => {
        if (contentRef.current?.parentElement?.children) {
            [...contentRef.current?.parentElement?.children].forEach((el) => {
                if (el instanceof HTMLDivElement) {
                    el.style.setProperty("animation-play-state", "paused");
                }
            });
        }
    }, []);

    const onMouseLeave = useCallback(() => {
        if (contentRef.current?.parentElement?.children) {
            [...contentRef.current?.parentElement?.children].forEach((el) => {
                if (el instanceof HTMLDivElement) {
                    el.style.setProperty("animation-play-state", "running");
                }
            });
        }
    }, []);

    return { contentRef, onMouseEnter, onMouseLeave }
}