"use client";

import { ArrowUpRight, MoveUpRight, ScanLine } from "lucide-react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";
import styles from "./product-reveal.module.css";

const SPOTLIGHT_R = 260;
const BASE_IMAGE = "/images/product-blueprint.svg";
const REVEAL_IMAGE = "/images/product-polished.svg";

function RevealLayer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const reveal = layer.current;
    if (!node || !reveal) return;
    const context = node.getContext("2d");
    if (!context) return;
    const size = SPOTLIGHT_R * 2;
    node.width = size;
    node.height = size;
    const gradient = context.createRadialGradient(
      SPOTLIGHT_R,
      SPOTLIGHT_R,
      0,
      SPOTLIGHT_R,
      SPOTLIGHT_R,
      SPOTLIGHT_R,
    );
    for (const [stop, opacity] of [
      [0, 1],
      [0.4, 1],
      [0.6, 0.75],
      [0.75, 0.4],
      [0.88, 0.12],
      [1, 0],
    ]) {
      gradient.addColorStop(stop, `rgba(255,255,255,${opacity})`);
    }
    context.clearRect(0, 0, size, size);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(SPOTLIGHT_R, SPOTLIGHT_R, SPOTLIGHT_R, 0, Math.PI * 2);
    context.fill();
    // Cache the same soft canvas mask; move it instead of encoding a full
    // viewport PNG and causing a React render on every pointer frame.
    reveal.style.setProperty("--spotlight-mask", `url("${node.toDataURL()}")`);
  }, []);

  return (
    <>
      <canvas ref={canvas} hidden aria-hidden="true" />
      <div
        ref={layer}
        className={`${styles.art} ${styles.reveal}`}
        style={{ backgroundImage: `url(${REVEAL_IMAGE})` }}
        aria-hidden="true"
      />
    </>
  );
}

export function ProductReveal() {
  const section = useRef<HTMLElement>(null);
  const entered = useInView(section, { once: true, amount: 0.2 });
  const reduced = useReducedMotionPreference();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    let frame = 0;
    let active = false;
    const mouse = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    function update() {
      frame = 0;
      if (!node || !active || document.hidden) return;
      smooth.x = reduced ? mouse.x : smooth.x + (mouse.x - smooth.x) * 0.1;
      smooth.y = reduced ? mouse.y : smooth.y + (mouse.y - smooth.y) * 0.1;
      node.style.setProperty("--spot-x", `${smooth.x.toFixed(2)}px`);
      node.style.setProperty("--spot-y", `${smooth.y.toFixed(2)}px`);
      if (
        Math.abs(mouse.x - smooth.x) > 0.1 ||
        Math.abs(mouse.y - smooth.y) > 0.1
      ) {
        frame = requestAnimationFrame(update);
      }
    }
    function move(event: PointerEvent) {
      if (
        !node ||
        finished ||
        !finePointer.matches ||
        event.pointerType === "touch"
      )
        return;
      const bounds = node.getBoundingClientRect();
      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
      if (!active) {
        smooth.x = mouse.x;
        smooth.y = mouse.y;
      }
      active = true;
      node.dataset.spotlight = "true";
      if (!frame) frame = requestAnimationFrame(update);
    }
    function reset() {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      if (node) node.dataset.spotlight = "false";
    }
    const observer = new ResizeObserver(reset);
    observer.observe(node);
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", reset);
    finePointer.addEventListener("change", reset);
    return () => {
      reset();
      observer.disconnect();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", reset);
      document.removeEventListener("visibilitychange", reset);
      finePointer.removeEventListener("change", reset);
    };
  }, [reduced, finished]);

  return (
    <section
      ref={section}
      id="product-reveal"
      aria-labelledby="product-reveal-heading"
      className={styles.section}
      data-entered={entered}
      data-finished={finished}
      data-reduced={reduced}
      data-spotlight="false"
    >
      <div className={styles.scene} aria-hidden="true">
        <div
          className={styles.art}
          style={{ backgroundImage: `url(${BASE_IMAGE})` }}
        />
        <RevealLayer />
      </div>
      <div className={styles.topline}>
        <span>NEXTWEB STUDIO / THE TRANSFORMATION</span>
        <span className={styles.concept}>INTERFACE CONCEPT · SAMPLE DATA</span>
      </div>
      <div className={styles.heading}>
        <h2 id="product-reveal-heading">
          <span className={styles.serif}>Built from an idea.</span>
          <span>Revealed as a product.</span>
        </h2>
      </div>
      <div className={styles.copy}>
        <span className={styles.marker}>
          <span /> FROM WIREFRAME TO INTERFACE
        </span>
        <p>
          Every polished product starts with a clear structure. The details turn
          it into an experience people want to use.
        </p>
      </div>
      <div className={styles.actions}>
        <p className={styles.pointerHint}>
          <MoveUpRight size={15} aria-hidden="true" /> Move your cursor to
          reveal the finish.
        </p>
        <button
          type="button"
          className={styles.compare}
          aria-pressed={finished}
          aria-describedby="product-reveal-description"
          onClick={() => setFinished((value) => !value)}
        >
          <ScanLine size={16} aria-hidden="true" />
          {finished ? "View the blueprint" : "View styled concept"}
        </button>
        <Link href="/contact?source=product-reveal" className={styles.cta}>
          Build your product <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <p id="product-reveal-description" className="sr-only">
        An illustrative dashboard transforms from a wireframe with code labels
        into a finished blue product interface. Use the comparison button to
        switch the entire image. No pointer is required.
      </p>
      <span className={styles.state} role="status">
        {finished ? "Styled concept" : "Product blueprint"}
      </span>
    </section>
  );
}
