// src/hooks/useLocoScroll.js
import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

export const useLocoScroll = (start = true) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const scrollEl = document.querySelector("[data-scroll-container]");

    scrollRef.current = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      lerp: 0.08,
    });

    setTimeout(() => {
      scrollRef.current.update();
    }, 100);

    return () => {
      scrollRef.current?.destroy();
    };
  }, [start]);

  return scrollRef;
};
