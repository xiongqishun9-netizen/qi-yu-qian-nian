export type Verification = 'verified' | 'to-verify' | 'comparative'

export interface SourceRecord {
  id: string
  category: '古籍语境' | '考古材料' | '机械解释' | '比较性工艺' | '馆藏参照'
  title: string
  citation: string
  note: string
  url?: string
}

export interface PartRecord {
  id: string
  number: string
  name: string
  english: string
  material: string
  function: string
  source: string
  verification: Verification
}

export interface WeaponRecord {
  id: string
  title: string
  subtitle: string
  era: string
  material: string
  description: string
  verified: boolean
  parts: PartRecord[]
}

export interface ChapterRecord {
  id: string
  label: string
  title: string
  quote: string
}

export interface AssetManifest {
  prologueAtmosphere: string
  prologueMobile: string
  prologueClean: string
  castingAtmosphere: string
  paperNoise: string
  figureLine: string
  usageMural: string
  usageMethods: string
  usageFormation: string
}

export interface CameraState {
  cameraX: number
  cameraY: number
  cameraZ: number
  perspective: number
  focusDepth: number
  blurStrength: number
  sceneScale: number
}

export interface AtmosphereState {
  fog: number
  grain: number
  warmth: number
  contrast: number
  blur: number
  particleDensity: number
  lightIntensity: number
  depth: number
}

export interface SceneState {
  activeChapter: string
  globalProgress: number
  structureProgress: number
  mouseX: number
  mouseY: number
  activePart: string | null
  camera: CameraState
  atmosphere: AtmosphereState
}
