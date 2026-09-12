"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { usePageVisible } from "@/components/animations/use-page-visible";
import styles from "./studio-motion.module.css";

export function AmbientMotion({
  variant,
}: {
  variant: "border" | "connections";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.05 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotionPreference();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${styles.ambient} ${styles[variant]}`}
      data-running={visible && pageVisible && !reduced}
    >
      {variant === "border" ? (
        <svg focusable="false">
          <rect
            width="100%"
            height="100%"
            rx="24"
            pathLength="100"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 800 340" fill="none" focusable="false">
          <path
            className={styles.track}
            d="M80 300V230H290L360 160H560L650 70H800M320 340V265L415 170V80H700"
          />
          <path
            className={styles.packet}
            d="M80 300V230H290L360 160H560L650 70H800"
            pathLength="100"
          />
          <path
            className={`${styles.packet} ${styles.secondPacket}`}
            d="M320 340V265L415 170V80H700"
            pathLength="100"
          />
          <circle cx="290" cy="230" r="3" />
          <circle cx="560" cy="160" r="3" />
          <circle cx="415" cy="80" r="3" />
        </svg>
      )}
    </div>
  );
}
