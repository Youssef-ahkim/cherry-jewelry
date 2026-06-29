"use client"

import { useRef, ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxImageProps {
  children: ReactNode
  speed?: number
  className?: string
}

export default function ParallaxImage({
  children,
  speed = 0.3,
  className = "",
}: ParallaxImageProps) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`])

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
        {children}
      </motion.div>
    </div>
  )
}
