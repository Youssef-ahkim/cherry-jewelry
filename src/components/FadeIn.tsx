"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView, Variant } from "framer-motion"

interface FadeInProps {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
}

const directionOffsets: Record<string, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
}

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const offset = directionOffsets[direction] || { y: 40 }

  const hidden: Variant = {
    opacity: 0,
    ...offset,
  }

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      className={className}
    >
      {children}
    </motion.div>
  )
}
