import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverProps {
    onIntersect: () => void;
    enabled?: boolean;
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}

export const useIntersectionObserver = ({
    onIntersect,
    enabled = true,
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
}: UseIntersectionObserverProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const ref = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (enabled && node) {
                observerRef.current = new IntersectionObserver(
                    (entries) => {
                        const [entry] = entries;
                        if (entry.isIntersecting) {
                            onIntersect();
                        }
                    },
                    { root, rootMargin, threshold }
                );

                observerRef.current.observe(node);
            }
        },
        [onIntersect, enabled, root, rootMargin, threshold]
    );

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return ref;
};
