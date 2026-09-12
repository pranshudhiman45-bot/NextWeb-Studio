"use client";

import { useReducedMotionPreference } from "@/components/animations/use-reduced-motion-preference";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Layers3, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { usePageVisible } from "@/components/animations/use-page-visible";
import styles from "./product-pipeline.module.css";

const stages = [
  {
    name: "Idea",
    title: "Start with a possibility.",
    detail: "One clear problem. A product worth building.",
    tech: ["Concept", "Product thinking"],
  },
  {
    name: "Design",
    title: "Give the idea a shape.",
    detail: "Flows, structure and a considered interface.",
    tech: ["Wireframes", "Interface design"],
  },
  {
    name: "Frontend",
    title: "Make every interaction count.",
    detail: "A responsive interface, ready for real people.",
    tech: ["Next.js", "React", "TypeScript"],
  },
  {
    name: "Backend",
    title: "Connect the experience.",
    detail: "Server logic turns interactions into actions.",
    tech: ["Next.js Server", "APIs"],
  },
  {
    name: "Database",
    title: "Give the product a memory.",
    detail: "Structured data, connected to the experience.",
    tech: ["MongoDB", "Data models"],
  },
  {
    name: "Deploy",
    title: "From build to browser.",
    detail: "The interface and its systems come together.",
    tech: ["Build", "Vercel"],
  },
  {
    name: "Live Product",
    title: "An idea, made real.",
    detail: "A walkthrough of how a product comes together.",
    tech: ["Built to ship", "Ready to grow"],
  },
] as const;

export function ProductPipeline() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.15 });
  const pageVisible = usePageVisible();
  const reduced = useReducedMotionPreference();
  const [selection, setSelection] = useState({ index: 0, manual: false });
  const [paused, setPaused] = useState(false);
  const index = reduced && !selection.manual ? 6 : selection.index;
  const active = stages[index];
  const running = inView && pageVisible && !reduced && !paused;
  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const lightXTarget = useMotionValue(0);
  const lightYTarget = useMotionValue(0);
  const rotateX = useSpring(rotateXTarget, { stiffness: 100, damping: 24 });
  const rotateY = useSpring(rotateYTarget, { stiffness: 100, damping: 24 });
  const lightX = useSpring(lightXTarget, { stiffness: 90, damping: 25 });
  const lightY = useSpring(lightYTarget, { stiffness: 90, damping: 25 });
  const duration = reduced ? 0 : 0.75;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => {
        setSelection((current) => ({
          index: (current.index + 1) % stages.length,
          manual: false,
        }));
      },
      selection.manual ? 8000 : 3600,
    );
    return () => window.clearTimeout(timer);
  }, [running, selection]);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      ).matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
    );
    rotateXTarget.set(y * -5);
    rotateYTarget.set(x * 5);
    lightXTarget.set(x * 36);
    lightYTarget.set(y * 24);
  }

  function resetPointer() {
    rotateXTarget.set(0);
    rotateYTarget.set(0);
    lightXTarget.set(0);
    lightYTarget.set(0);
  }

  return (
    <div ref={root} className={styles.perspective}>
      <motion.div
        className={styles.pipeline}
        data-stage={active.name}
        data-running={running}
        data-reduced={Boolean(reduced)}
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={resetPointer}
        role="region"
        aria-label="From idea to live product"
      >
        <motion.div
          aria-hidden="true"
          className={styles.light}
          style={{ x: lightX, y: lightY }}
        />
        <div className={styles.header}>
          <span className={styles.identity}>
            <Layers3 size={15} aria-hidden="true" /> THE BUILD SEQUENCE
          </span>
          {!reduced ? (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className={styles.pause}
              aria-label={
                paused ? "Resume build animation" : "Pause build animation"
              }
              aria-pressed={paused}
            >
              {paused ? (
                <Play size={14} aria-hidden="true" />
              ) : (
                <Pause size={14} aria-hidden="true" />
              )}
            </button>
          ) : (
            <span className={styles.staticLabel}>EXPLORE</span>
          )}
        </div>
        <div className={styles.caption} aria-live="off">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={index}
              className={styles.captionContent}
              initial={reduced ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -5 }}
              transition={{ duration: reduced ? 0 : 0.35 }}
            >
              <h2>{active.title}</h2>
              <p>{active.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <svg
          className={styles.diagram}
          viewBox="0 0 480 300"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M24 18h12M24 18v12M456 18h-12M456 18v12M24 286h12M24 286v-12M456 286h-12M456 286v-12"
            fill="none"
            stroke="var(--viz-line, #24415f)"
          />
          <path
            d="M24 104H456M24 194H456M128 18V286M352 18V286"
            fill="none"
            stroke="var(--viz-line, #163049)"
            opacity=".35"
            strokeDasharray="2 7"
          />
          <motion.g
            animate={{
              opacity: index === 0 ? 1 : 0,
              scale: index === 0 ? 1 : 0.86,
            }}
            transition={{ duration }}
            style={{ transformOrigin: "240px 139px" }}
          >
            <circle
              cx="240"
              cy="133"
              r="48"
              fill="var(--viz-panel, #051a30)"
              stroke="var(--viz-line, #183d63)"
            />
            <circle
              cx="240"
              cy="133"
              r="29"
              fill="var(--viz-inset, #0b2e50)"
              stroke="var(--viz-blue, #2e90ff)"
            />
            <path
              d="m240 118 12 15-12 15-12-15Z"
              fill="none"
              stroke="var(--viz-cyan, #83d9f5)"
              strokeWidth="1.5"
            />
            <path
              d="M174 133h18m96 0h18m-66-66v18m0 96v18"
              stroke="var(--viz-blue, #2e90ff)"
              opacity=".5"
            />
            <text
              x="240"
              y="220"
              textAnchor="middle"
              fill="var(--viz-muted, #a9bfd5)"
              fontSize="10"
              letterSpacing="2"
            >
              A CLEAR STARTING POINT
            </text>
          </motion.g>
          <motion.g
            animate={{ opacity: index >= 1 ? 1 : 0, y: index >= 1 ? 0 : 10 }}
            transition={{ duration }}
          >
            <rect
              x="48"
              y="27"
              width="384"
              height="181"
              rx="12"
              fill="var(--viz-panel, #051225)"
              stroke={
                index >= 2
                  ? "var(--viz-blue, #2865a0)"
                  : "var(--viz-line, #31516d)"
              }
            />
            <path d="M48 55h384" stroke="var(--viz-line, #203b57)" />
            <circle cx="62" cy="41" r="2.5" fill="var(--viz-dot, #536f8c)" />
            <circle cx="72" cy="41" r="2.5" fill="var(--viz-dot, #315575)" />
            <circle cx="82" cy="41" r="2.5" fill="var(--viz-dot, #24405a)" />
            <rect
              x="164"
              y="35"
              width="152"
              height="12"
              rx="4"
              fill="var(--viz-inset, #0b2037)"
            />
            <text
              x="240"
              y="44"
              textAnchor="middle"
              fill="var(--viz-muted, #91acc8)"
              fontSize="7"
            >
              nextweb / your-product
            </text>
            <motion.g
              animate={{ opacity: index >= 2 ? 1 : 0.28 }}
              transition={{ duration }}
            >
              <rect
                x="66"
                y="70"
                width="18"
                height="18"
                rx="5"
                fill="#0870ed"
              />
              <path
                d="m71 80 3-4 2 7 3-5"
                fill="none"
                stroke="white"
                strokeWidth="1.3"
              />
              <text
                x="93"
                y="81"
                fill="var(--viz-text, #ecf4ff)"
                fontSize="9"
                fontWeight="600"
              >
                Your product
              </text>
              <rect
                x="351"
                y="72"
                width="61"
                height="13"
                rx="5"
                fill={
                  index === 6
                    ? "var(--viz-active, #113c55)"
                    : "var(--viz-active, #102942)"
                }
              />
              <circle
                cx="361"
                cy="78.5"
                r="2"
                fill={
                  index === 6
                    ? "var(--viz-cyan, #10d9f5)"
                    : "var(--viz-dot, #536f8c)"
                }
              />
              <text
                x="383"
                y="81.5"
                textAnchor="middle"
                fill={
                  index === 6
                    ? "var(--viz-text, #99efff)"
                    : "var(--viz-muted, #8ba5c0)"
                }
                fontSize="7"
                letterSpacing="1"
              >
                {index === 6 ? "LIVE" : "BUILD"}
              </text>
            </motion.g>
            {[0, 1, 2].map((card) => (
              <motion.g
                key={card}
                animate={{ opacity: index >= 1 ? 1 : 0, y: index >= 1 ? 0 : 8 }}
                transition={{ duration, delay: reduced ? 0 : card * 0.12 }}
              >
                <rect
                  x={66 + card * 119}
                  y="103"
                  width="109"
                  height="70"
                  rx="6"
                  fill={
                    index >= 2
                      ? "var(--viz-inset, #0b223b)"
                      : "var(--viz-inset, #07172b)"
                  }
                  stroke={
                    index === 1
                      ? "var(--viz-line, #395774)"
                      : "var(--viz-line, #183c60)"
                  }
                  strokeDasharray={index === 1 ? "4 4" : undefined}
                />
                <rect
                  x={77 + card * 119}
                  y="115"
                  width="35"
                  height="3"
                  rx="1.5"
                  fill="var(--viz-muted, #567693)"
                />
                <motion.rect
                  x={77 + card * 119}
                  y="127"
                  width={45 + card * 9}
                  height="7"
                  rx="2"
                  fill={
                    index >= 2
                      ? "var(--viz-text, #d6e7fa)"
                      : "var(--viz-line, #274563)"
                  }
                  animate={{ scaleX: index >= 1 ? 1 : 0 }}
                  style={{ transformOrigin: `${77 + card * 119}px 127px` }}
                  transition={{ duration, delay: reduced ? 0 : card * 0.12 }}
                />
                <motion.path
                  d={`M${77 + card * 119} 159l16-7 12 3 16-13 13 3 19-11`}
                  fill="none"
                  stroke={
                    card === 1
                      ? "var(--viz-cyan, #63c9ec)"
                      : "var(--viz-blue, #2e90ff)"
                  }
                  strokeWidth="1.5"
                  animate={{
                    pathLength: index >= 2 ? 1 : 0,
                    opacity: index >= 2 ? 0.85 : 0,
                  }}
                  transition={{
                    duration: reduced ? 0 : 1,
                    delay: reduced ? 0 : card * 0.12,
                  }}
                />
              </motion.g>
            ))}
            <rect
              x="66"
              y="187"
              width="348"
              height="3"
              rx="1.5"
              fill="var(--viz-line, #17324e)"
            />
            <motion.rect
              x="66"
              y="187"
              width="348"
              height="3"
              rx="1.5"
              fill="var(--viz-blue, #2e90ff)"
              animate={{ scaleX: index >= 5 ? 1 : 0 }}
              style={{ transformOrigin: "66px 187px" }}
              transition={{
                duration: reduced ? 0 : index >= 5 ? 2.3 : 0.7,
                ease: "easeInOut",
              }}
            />
          </motion.g>
          <motion.g
            className={styles.systemNodes}
            animate={{ opacity: index >= 3 ? 1 : 0, y: index >= 3 ? 0 : -6 }}
            transition={{ duration }}
          >
            <path
              d="M240 208v14H87v17m153-17h153v17M240 222v17"
              fill="none"
              stroke="var(--viz-line, #1f4567)"
            />
            <motion.path
              d="M240 208v14H87v17m153-17h153v17M240 222v17"
              fill="none"
              stroke="var(--viz-blue, #2e90ff)"
              strokeWidth="1.2"
              animate={{ pathLength: index >= 3 ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 1.4 }}
            />
            <rect
              x="32"
              y="239"
              width="110"
              height="35"
              rx="7"
              fill="var(--viz-inset, #081d33)"
              stroke="var(--viz-line, #24547d)"
            />
            <text
              x="87"
              y="260"
              textAnchor="middle"
              fontSize="9"
              fill="var(--viz-text, #b3cbe3)"
            >
              CLIENT
            </text>
            <rect
              x="185"
              y="239"
              width="110"
              height="35"
              rx="7"
              fill="var(--viz-inset, #081d33)"
              stroke="var(--viz-blue, #2e90ff)"
            />
            <text
              x="240"
              y="260"
              textAnchor="middle"
              fontSize="9"
              fill="var(--viz-text, #a9dcff)"
            >
              API
            </text>
            <motion.g
              animate={{ opacity: index >= 4 ? 1 : 0.2 }}
              transition={{ duration }}
            >
              <rect
                x="338"
                y="239"
                width="110"
                height="35"
                rx="7"
                fill="var(--viz-inset, #081d33)"
                stroke="var(--viz-cyan, #4c9dc4)"
              />
              <path
                d="M354 251c0-4 16-4 16 0v11c0 4-16 4-16 0Zm0 0c0 4 16 4 16 0m-16 5c0 4 16 4 16 0"
                fill="none"
                stroke="var(--viz-cyan, #8ce6f5)"
                strokeWidth="1"
              />
              <text
                x="403"
                y="260"
                textAnchor="middle"
                fontSize="9"
                fill="var(--viz-text, #b3cbe3)"
              >
                DATA
              </text>
            </motion.g>
          </motion.g>
          <motion.g
            className={styles.mobileNodes}
            animate={{ opacity: index >= 3 ? 1 : 0 }}
            transition={{ duration }}
          >
            <path
              d="M128 246H352M240 208v38"
              stroke="var(--viz-line, #2d638e)"
              fill="none"
            />
            <circle
              cx="128"
              cy="246"
              r="5"
              fill="var(--viz-inset, #163d64)"
              stroke="var(--viz-blue, #2e90ff)"
            />
            <circle
              cx="240"
              cy="246"
              r="5"
              fill="var(--viz-inset, #163d64)"
              stroke="var(--viz-blue, #2e90ff)"
            />
            <motion.circle
              cx="352"
              cy="246"
              r="5"
              fill="var(--viz-inset, #163d64)"
              stroke="var(--viz-cyan, #73d4eb)"
              animate={{ opacity: index >= 4 ? 1 : 0.25 }}
              transition={{ duration }}
            />
          </motion.g>
        </svg>

        <div className={styles.stageDetails}>
          <span className={styles.stageNumber}>
            {String(index + 1).padStart(2, "0")} <span>/ 07</span>
          </span>
          <div className={styles.technologies}>
            {active.tech.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            className={styles.detailArrow}
          />
        </div>
        <div
          className={styles.stages}
          role="group"
          aria-label="Product build stages"
          aria-describedby="build-stage-help"
        >
          {stages.map((stage, stageIndex) => (
            <button
              key={stage.name}
              type="button"
              aria-label={`Show ${stage.name} stage`}
              aria-pressed={index === stageIndex}
              className={styles.stage}
              onClick={() => setSelection({ index: stageIndex, manual: true })}
            >
              <span aria-hidden="true" className={styles.stageDot} />
              {stageIndex === 6 ? "Live" : stage.name}
            </button>
          ))}
        </div>
        <p id="build-stage-help" className={styles.help}>
          {reduced
            ? "Choose a stage to explore. Motion is reduced."
            : paused
              ? "Sequence paused. Choose any stage to explore."
              : "Explore a stage. The sequence resumes after 8 seconds."}
        </p>
      </motion.div>
    </div>
  );
}
