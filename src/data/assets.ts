import type { AssetManifest } from '../types/story'

const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export const assets: AssetManifest = {
  prologueAtmosphere: asset('backgrounds/prologue-atmosphere-v2.png'),
  prologueMobile: asset('backgrounds/opening-mobile.png'),
  prologueClean: asset('backgrounds/opening-art-clean.png'),
  castingAtmosphere: asset('craft/casting-atmosphere.png'),
  paperNoise: asset('textures/paper-noise.svg'),
  figureLine: asset('figures/usage-figure.svg'),
  usageMural: asset('figures/usage-mural.png'),
  usageMethods: asset('figures/usage-methods.png'),
  usageFormation: asset('figures/usage-formation.png'),
}
