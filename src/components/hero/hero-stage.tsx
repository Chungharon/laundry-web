"use client"

import * as React from "react"
import dynamic from "next/dynamic"

const HeroScene = dynamic(() => import("@/components/hero/hero-scene"), { ssr: false })

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

/**
 * Decides whether the 3D scene mounts at all (design system flow.md):
 * never under reduced motion, Save-Data, or a device reporting 4 or fewer
 * cores or 4 GB or less memory (Chromium-only hints; with no hint, mount).
 * Otherwise it mounts once the browser is idle. In every other case the
 * static image underneath is the hero.
 */
export function HeroStage() {
  const [mount, setMount] = React.useState(false)

  React.useEffect(() => {
    const nav = navigator as NavigatorHints
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = nav.connection?.saveData === true
    const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4
    if (reducedMotion || saveData || fewCores || lowMemory) return

    // requestIdleCallback is missing in Safari: fall back to a short timeout.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setMount(true), { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setMount(true), 1200)
    return () => clearTimeout(id)
  }, [])

  return mount ? <HeroScene /> : null
}
