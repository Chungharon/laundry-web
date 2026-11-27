/*
 * The hero scene: six folded garments, one per step of the service, drop onto
 * a stack one at a time; then the stack turns gently with the pointer or
 * device tilt. Flat slabs only: BoxGeometry, MeshLambertMaterial with
 * flatShading, one directional + one ambient light. No shadows, textures,
 * models, environment maps or post-processing (design system flow.md).
 *
 * Framework-free so the same code renders the live canvas (HeroScene) and the
 * static first frame (scripts/render-hero.sh → public/hero/hero-stack.avif).
 *
 * Framing is "contain": the stack fills the same share of the shorter side at
 * any aspect, so the canvas lines up with the square static image drawn with
 * object-fit: contain underneath it.
 */
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"

// Brand inks (tokens.json). Bottom to top.
const NAVY = "#152837"
const STEEL = "#4682b4"
const SLATE = "#708090"
const SKY = "#87ceeb"
const FLORAL = "#fffaf0"

type Garment = { color: string; w: number; d: number; x: number; z: number; rot: number }

const GARMENTS: Garment[] = [
  { color: NAVY, w: 3.3, d: 2.45, x: 0.0, z: 0.0, rot: 0.0 },
  { color: STEEL, w: 3.15, d: 2.35, x: 0.08, z: -0.05, rot: 0.05 },
  { color: FLORAL, w: 3.2, d: 2.4, x: -0.07, z: 0.04, rot: -0.04 },
  { color: SLATE, w: 3.05, d: 2.3, x: 0.05, z: 0.06, rot: 0.07 },
  { color: FLORAL, w: 3.1, d: 2.3, x: -0.04, z: -0.04, rot: -0.03 },
  { color: SKY, w: 2.95, d: 2.2, x: 0.03, z: 0.02, rot: 0.04 },
]

const SLAB = 0.36 // height of one folded garment
const FOLD = 0.07 // the folded-over layer on top of each garment
const STACK_HEIGHT = GARMENTS.length * SLAB
const BASE_YAW = -0.55 // three-quarter view
const FOV = 28 // vertical field of view at aspect >= 1
const FILL = 0.9 // share of the shorter side the stack's bounding sphere fills

const DROP_MS = 460
const STAGGER_MS = 230
const DROP_FROM = 4.5 // units above the resting position

// The hero card's ground (--lh-mist). The live canvas is transparent; the static
// render paints this so it blends into the card.
export const BACKGROUND = "#cfdde8"

export type StackScene = {
  /** Size in CSS pixels and device pixel ratio (capped at 2). */
  resize: (width: number, height: number, dpr: number) => void
  /** -1..1 on each axis; the stack eases toward it. */
  setPointer: (nx: number, ny: number) => void
  /** Allow (true) or pause (false) the render loop: off-screen or hidden tab. */
  setActive: (active: boolean) => void
  /** Draw one frame synchronously (used by the static render). */
  renderNow: () => void
  dispose: () => void
}

export function createStackScene({
  canvas,
  animate,
  opaque = false,
  onFirstFrame,
}: {
  canvas: HTMLCanvasElement
  /** false renders the final frame straight away (static image, reduced motion). */
  animate: boolean
  /** Paint the mist ground (BACKGROUND) instead of a transparent one. */
  opaque?: boolean
  onFirstFrame?: () => void
}): StackScene {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: !opaque,
    preserveDrawingBuffer: opaque, // lets a headless screenshot read the frame
    powerPreference: "low-power",
  })
  renderer.setClearColor(new Color(BACKGROUND), opaque ? 1 : 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)

  scene.add(new AmbientLight(0xffffff, 1.35))
  const sun = new DirectionalLight(0xffffff, 1.9)
  sun.position.set(-3, 8, 5)
  scene.add(sun)

  const stack = new Group()
  stack.rotation.y = BASE_YAW
  stack.position.y = -STACK_HEIGHT / 2
  scene.add(stack)

  const geometries: BoxGeometry[] = []
  const materials = new Map<string, MeshLambertMaterial>()
  const garments: { group: Group; restY: number }[] = []

  for (const [i, g] of GARMENTS.entries()) {
    let material = materials.get(g.color)
    if (!material) {
      material = new MeshLambertMaterial({ color: new Color(g.color), flatShading: true })
      materials.set(g.color, material)
    }
    const body = new BoxGeometry(g.w, SLAB - FOLD, g.d)
    // The folded-over half: a thinner layer across the front of the garment.
    const fold = new BoxGeometry(g.w * 0.97, FOLD, g.d * 0.52)
    geometries.push(body, fold)

    const group = new Group()
    const bodyMesh = new Mesh(body, material)
    bodyMesh.position.y = (SLAB - FOLD) / 2
    const foldMesh = new Mesh(fold, material)
    foldMesh.position.set(0, SLAB - FOLD / 2, g.d * 0.24)
    group.add(bodyMesh, foldMesh)

    const restY = i * SLAB
    group.position.set(g.x, animate ? restY + DROP_FROM : restY, g.z)
    group.rotation.y = g.rot
    stack.add(group)
    garments.push({ group, restY })
  }

  // Camera: look slightly down at the stack, distance set so the bounding
  // sphere fills FILL of the shorter side.
  const radius = Math.hypot(1.7, STACK_HEIGHT / 2, 1.25)
  const elevation = 0.5 // radians above the horizon
  function frame(aspect: number) {
    // Below aspect 1, hold the horizontal field of view instead of the vertical.
    const halfV = (FOV * Math.PI) / 360
    camera.fov = aspect >= 1 ? FOV : (2 * Math.atan(Math.tan(halfV) / aspect) * 180) / Math.PI
    camera.aspect = aspect
    const distance = radius / Math.sin(halfV) / FILL
    camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }

  let width = 1
  let height = 1
  let active = true
  let raf = 0
  let start = -1
  let firstFrame = true
  let dropping = animate
  const target = { yaw: 0, pitch: 0 }
  const current = { yaw: 0, pitch: 0 }

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

  function step(time: number) {
    raf = 0
    if (start < 0) start = time
    let moving = false

    if (dropping) {
      const elapsed = time - start
      dropping = false
      for (const [i, g] of garments.entries()) {
        const t = Math.min(1, Math.max(0, (elapsed - i * STAGGER_MS) / DROP_MS))
        g.group.position.y = g.restY + DROP_FROM * (1 - easeOut(t))
        if (t < 1) dropping = true
      }
      moving = dropping
    }

    // Ease toward the pointer target; stop when close enough.
    current.yaw += (target.yaw - current.yaw) * 0.08
    current.pitch += (target.pitch - current.pitch) * 0.08
    if (Math.abs(target.yaw - current.yaw) > 0.0005 || Math.abs(target.pitch - current.pitch) > 0.0005) {
      moving = true
    }
    stack.rotation.y = BASE_YAW + current.yaw
    stack.rotation.x = current.pitch

    renderer.render(scene, camera)
    if (firstFrame) {
      firstFrame = false
      onFirstFrame?.()
    }
    if (moving) schedule()
  }

  function schedule() {
    if (!raf && active) raf = requestAnimationFrame(step)
  }

  return {
    resize(w, h, dpr) {
      width = Math.max(1, w)
      height = Math.max(1, h)
      renderer.setPixelRatio(Math.min(dpr, 2))
      renderer.setSize(width, height, false)
      frame(width / height)
      schedule()
    },
    setPointer(nx, ny) {
      target.yaw = Math.max(-1, Math.min(1, nx)) * 0.45
      target.pitch = Math.max(-1, Math.min(1, ny)) * 0.12
      schedule()
    },
    setActive(next) {
      active = next
      if (!active && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (active) {
        // Resuming mid-drop restarts the clock so the drop doesn't skip ahead.
        if (dropping) start = -1
        schedule()
      }
    },
    renderNow() {
      if (raf) cancelAnimationFrame(raf)
      step(performance.now())
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      active = false
      for (const g of geometries) g.dispose()
      for (const m of materials.values()) m.dispose()
      renderer.dispose()
    },
  }
}
