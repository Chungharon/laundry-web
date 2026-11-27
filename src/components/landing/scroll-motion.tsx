"use client"

import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/*
 * Motion shows structure (design system flow.md):
 * - [data-rule]: a section-edge rule draws across, scaleX 0→1 from the left, 600ms power2.inOut.
 * - [data-reveal] > *: cells enter on scroll, y 24px + opacity, 500ms power3.out, 60ms stagger.
 * Only under prefers-reduced-motion: no-preference; otherwise everything is
 * simply in its final state. Content is fully visible without JavaScript.
 */
export function ScrollMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: rule, start: "top 92%", once: true },
          })
        })
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((group) => {
          gsap.from(group.children, {
            y: 24,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope }
  )

  return <div ref={scope}>{children}</div>
}
