import { useEffect, useRef } from "react";

export const useClickAway = (handler, exceptionRefs) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      const target = event.target;
      if (!target) return;

      const el = ref.current;
      if (!el || el.contains(target)) {
        return;
      }

      const exceptionElements = exceptionRefs?.length
        ? exceptionRefs.map((exceptionRef) => exceptionRef.current)
        : null;

      const isException = exceptionElements?.some((exceptionEl) => exceptionEl?.contains(target));
      const isInPortal = target.parentElement?.closest("[data-headlessui-portal]");

      if (isException || isInPortal) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, exceptionRefs]);

  return ref;
};
