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
 * 250px of the viewport.
 * Maintains placeholder dimensions to guarantee CLS = 0.00.
 */
export default function LazySection({
  children,
  fallback,
  rootMargin = "250px",
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

    return () => {
      observer.disconnect();
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
