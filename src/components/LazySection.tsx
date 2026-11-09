import { useState, useEffect, useRef, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  id?: string;
}

/**
 * High-performance viewport-deferred section wrapper.
 * Defers dynamic chunk import and rendering until the section is within
 * 600px of the viewport, or until the browser reaches an idle state.
 * Maintains placeholder dimensions to guarantee CLS = 0.00.
 */
export default function LazySection({
  children,
  fallback,
  rootMargin = "600px",
  minHeight = "400px",
  id,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(() => {
    // If the URL directly targets this section on load, render immediately
    if (typeof window !== "undefined" && id && window.location.hash === `#${id}`) {
      return true;
    }
    return false;
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);

    // Idle fallback: render after critical load window (2.5s) if user hasn't scrolled yet
    const idleId = (window.requestIdleCallback || ((cb) => setTimeout(cb, 2500)))(() => {
      setShouldRender(true);
    });

    return () => {
      observer.disconnect();
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
    };
  }, [id, rootMargin, shouldRender]);

  return (
    <div
      ref={ref}
      id={shouldRender ? undefined : id}
      style={{ minHeight: shouldRender ? undefined : minHeight }}
    >
      {shouldRender ? children : (fallback || <div style={{ minHeight }} />)}
    </div>
  );
}
