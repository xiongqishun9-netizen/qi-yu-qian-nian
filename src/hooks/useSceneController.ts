import { useEffect, useMemo, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { AtmosphereState, CameraState, SceneState } from '../types/story'

gsap.registerPlugin(ScrollTrigger)

const defaultCamera: CameraState = {
  cameraX: 0, cameraY: 0, cameraZ: 0, perspective: 1250, focusDepth: 0, blurStrength: 0, sceneScale: 1,
}

const defaultAtmosphere: AtmosphereState = {
  fog: 0.12, grain: 0.18, warmth: 0, contrast: 1, blur: 0, particleDensity: 0.08, lightIntensity: 0.25, depth: 0,
}

export function useSceneController(
  sectionRefs: Record<string, RefObject<HTMLElement | null>>,
  structureRef: RefObject<HTMLElement | null>,
) {
  const [scene, setScene] = useState<SceneState>({
    activeChapter: 'prologue', globalProgress: 0, structureProgress: 0, mouseX: 0, mouseY: 0,
    activePart: null, camera: defaultCamera, atmosphere: defaultAtmosphere,
  })

  const ids = useMemo(() => Object.keys(sectionRefs), [sectionRefs])

  useEffect(() => {
    const triggers = ids.flatMap((id) => {
      const section = sectionRefs[id].current
      if (!section) return []
      return [ScrollTrigger.create({
        trigger: section,
        start: 'top 58%',
        end: 'bottom 42%',
        onToggle: (trigger) => trigger.isActive && setScene((prev) => ({ ...prev, activeChapter: id })),
      })]
    })
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScene((prev) => ({ ...prev, globalProgress: max > 0 ? window.scrollY / max : 0 }))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [ids, sectionRefs])

  useEffect(() => {
    const el = structureRef.current
    if (!el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        setScene((prev) => ({
          ...prev,
          structureProgress: p,
          camera: { ...prev.camera, cameraZ: p * 140, focusDepth: p * 1.2, sceneScale: 1 + p * 0.07 },
          atmosphere: { ...prev.atmosphere, depth: p, blur: p * 0.4, contrast: 1 + p * 0.08 },
        }))
      },
    })
    return () => trigger.kill()
  }, [structureRef])

  useEffect(() => {
    let raf = 0
    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScene((prev) => ({
        ...prev, mouseX: (event.clientX / window.innerWidth - 0.5) * 2, mouseY: (event.clientY / window.innerHeight - 0.5) * 2,
      })))
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onPointerMove) }
  }, [])

  return { scene, setActivePart: (activePart: string | null) => setScene((prev) => ({ ...prev, activePart })) }
}
