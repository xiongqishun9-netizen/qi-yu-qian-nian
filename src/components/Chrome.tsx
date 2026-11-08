import { chapters } from '../data/chapters'
import type { SceneState } from '../types/story'
import styles from '../App.module.css'

export function StoryNavigation({ activeChapter }: { activeChapter: string }) {
  return <nav className={styles.navigation} aria-label="章节导航">
    {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} className={activeChapter === chapter.id ? styles.activeNav : ''}>
      <span>{chapter.label}</span><b>{chapter.title}</b>
    </a>)}
  </nav>
}

export function ScrollProgress({ progress }: { progress: number }) {
  return <div className={styles.progress} aria-hidden="true"><i style={{ transform: `scaleY(${Math.max(progress, 0.015)})` }} /></div>
}

export function CustomCursor({ activePart }: Pick<SceneState, 'activePart'>) {
  return <div className={`${styles.cursorHint} ${activePart ? styles.cursorHintActive : ''}`} aria-hidden="true">
    {activePart ? 'FOCUS / 聚焦中' : 'SCROLL / 向下阅览'}
  </div>
}
