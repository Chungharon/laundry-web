"use client"

import * as React from "react"
import { createStackScene } from "@/components/hero/stack-scene"

/*
 * The live 3D canvas. Loaded only through <HeroStage> (dynamic, ssr: false,
 * after idle). It sits exactly over the static image and fades in once its
 * first frame is drawn, so nothing shifts. Rendering pauses off-screen and in
 * hidden tabs, and everything is disposed on unmount.
 */
export default function HeroScene() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let scene: ReturnType<typeof createStackScene>
    try {
      scene = createStackScene({ canvas, animate: true, onFirstFrame: () => setReady(true) })
    } catch {
      return // No WebGL: the static image stays.
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      scene.resize(rect.width, rect.height, window.devicePixelRatio || 1)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    let onScreen = true
    const sync = () => scene.setActive(onScreen && document.visibilityState === "visible")
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener("visibilitychange", sync)

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    // Device tilt where the browser offers it without a permission prompt.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      scene.setPointer(e.gamma / 30, (e.beta - 45) / 45)
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("deviceorientation", onTilt, { passive: true })

    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("deviceorientation", onTilt)
      document.removeEventListener("visibilitychange", sync)
      io.disconnect()
      resizeObserver.disconnect()
      scene.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full transition-opacity duration-400 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    />
  )
}
