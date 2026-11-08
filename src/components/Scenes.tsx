import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { assets } from '../data/assets'
import { craftStages } from '../data/archive'
import { sources } from '../data/sources'
import { bronzeTrigger } from '../data/weapons'
import type { PartRecord, SceneState, SourceRecord } from '../types/story'
import styles from '../App.module.css'

export function PrologueScene() {
  return <section id="prologue" className={`${styles.scene} ${styles.prologue}`}>
    <div className={styles.prologueImage} style={{ backgroundImage: `url(${assets.prologueAtmosphere})` }} />
    <div className={styles.paperGrain} />
    <p className={styles.eyebrow}>DIGITAL STUDY OF ANCIENT ARMS</p>
    <h1>器语<br /><em>千年</em></h1>
    <p className={styles.englishTitle}>THE LANGUAGE OF ANCIENT ARMS</p>
    <div className={styles.prologueFooter}><span>中国古代兵器数字交互科普体验</span><i /><span>向下，进入一件器物的时间</span></div>
  </section>
}

export function ShapeScene({ mouseX, mouseY }: Pick<SceneState, 'mouseX' | 'mouseY'>) {
  return <section id="shape" className={`${styles.scene} ${styles.shapeScene}`}>
    <div className={styles.sceneHeading}><p>第一章 / 见形</p><h2>器有其形<br />形有所因</h2><span>从被保存下来的金属机件，回看一张完整弩的结构关系。</span></div>
    <div className={styles.shapeField} style={{ '--mx': mouseX, '--my': mouseY } as React.CSSProperties}>
      <div className={styles.shapeBack}>弓 · 臂 · 弦 · 箭槽</div>
      <div className={styles.shapeLine} />
      <div className={styles.shapeObject}><span>GUO</span><span>YA</span><span>WANG SHAN</span><span>XUAN DAO</span></div>
      <div className={styles.shapeForeground}>BRONZE / WOOD / TENSION</div>
    </div>
    <p className={styles.sectionNote}>青铜弩机并不等同于完整的弩。木臂、弓与弦常难以保存，留存下来的金属机件成为理解整体的入口。</p>
  </section>
}

const transformFor = (id: string, p: number) => {
  const amount = Math.max(0, (p - 0.28) / 0.72)
  const map: Record<string, [number, number, number]> = { body: [0, 0, 0], tooth: [-116, 58, 72], sight: [38, -112, 128], trigger: [135, 65, 160], pin: [96, -42, 210] }
  const [x, y, z] = map[id]
  return `translate3d(${x * amount}px, ${y * amount}px, ${z * amount}px)`
}

export function WeaponLayer({ part, progress, activePart, onFocus }: { part: PartRecord, progress: number, activePart: string | null, onFocus: (id: string) => void }) {
  const faded = activePart && activePart !== part.id
  const handleKey = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onFocus(part.id) }
  }
  const common = { role: 'button', tabIndex: 0, 'aria-label': `${part.name}：${part.function}`, onClick: () => onFocus(part.id), onKeyDown: handleKey, className: `${styles.weaponPart} ${faded ? styles.weaponPartFaded : ''} ${activePart === part.id ? styles.weaponPartActive : ''}`, style: { transform: transformFor(part.id, progress) } }
  if (part.id === 'body') return <g {...common}><path d="M-278 -42 L-170 -94 L82 -94 L225 -34 L226 27 L104 64 L-140 66 L-282 29 Z" /><path className={styles.weaponInset} d="M-171 -37 L77 -37 L151 -13 L76 5 L-174 6 Z" /></g>
  if (part.id === 'tooth') return <g {...common}><path d="M-52 -79 L17 -79 L42 -23 L23 34 L-30 34 L-53 -12 Z" /><path className={styles.weaponInset} d="M-12 -78 L11 -31 L-10 -5 Z" /></g>
  if (part.id === 'sight') return <g {...common}><path d="M30 -153 L87 -153 L105 -64 L50 -48 L22 -74 Z" /><path className={styles.weaponInset} d="M49 -135 L71 -135 M46 -112 L76 -112 M43 -90 L82 -90" /></g>
  if (part.id === 'trigger') return <g {...common}><path d="M147 -13 L194 3 L209 103 L175 133 L143 105 L154 42 Z" /><path className={styles.weaponInset} d="M176 22 L174 96" /></g>
  return <g {...common}><circle cx="82" cy="2" r="21" /><circle className={styles.weaponInset} cx="82" cy="2" r="7" /></g>
}

export function PartFocus({ part, onClose }: { part: PartRecord | undefined, onClose: () => void }) {
  if (!part) return <div className={styles.focusPrompt}>滚动解开结构<br /><span>点击任一部件，查看其在机构中的位置</span></div>
  return <aside className={styles.partFocus} aria-live="polite"><button onClick={onClose} aria-label="关闭部件信息">×</button><span>{part.number}</span><h3>{part.name}<small>{part.english}</small></h3><dl><div><dt>结构</dt><dd>{part.function}</dd></div><div><dt>材质</dt><dd>{part.material}</dd></div><div><dt>资料</dt><dd>{part.source}</dd></div></dl><p className={styles.verify}>{part.verification === 'verified' ? '资料已核验' : part.verification === 'comparative' ? '比较性参照' : '资料待考证'}</p></aside>
}

export function WeaponExploder({ scene, onFocus }: { scene: SceneState, onFocus: (id: string | null) => void }) {
  const active = bronzeTrigger.parts.find((part) => part.id === scene.activePart)
  const numberOpacity = Math.max(0, (scene.structureProgress - 0.66) / 0.24)
  return <div className={styles.exploderFrame} style={{ '--structure': scene.structureProgress, '--camera-z': scene.camera.cameraZ } as React.CSSProperties}>
    <div className={styles.exploderMeta}><p>QY-CB-001 / CONCEPTUAL MODEL</p><span>{Math.round(scene.structureProgress * 100).toString().padStart(2, '0')}% / STRUCTURE DEPTH</span></div>
    <div className={styles.weaponStage}>
      <svg viewBox="-360 -240 720 480" aria-label="可交互的青铜弩机概念模型" className={styles.weaponSvg}>
        <defs><filter id="soft-shadow"><feGaussianBlur stdDeviation="7" /></filter></defs>
        <ellipse cx="0" cy="89" rx="245" ry="27" className={styles.weaponShadow} filter="url(#soft-shadow)" />
        {bronzeTrigger.parts.map((part) => <WeaponLayer key={part.id} part={part} progress={scene.structureProgress} activePart={scene.activePart} onFocus={onFocus} />)}
        {bronzeTrigger.parts.map((part, index) => <g className={styles.numberTag} opacity={numberOpacity} key={`tag-${part.id}`}><line x1={-285 + index * 141} y1="-191" x2={-254 + index * 141} y2="-154" /><text x={-302 + index * 141} y="-202">{part.number}</text></g>)}
      </svg>
      <div className={styles.structureLines} style={{ opacity: Math.min(1, scene.structureProgress * 2.3) }} />
    </div>
    <PartFocus part={active} onClose={() => onFocus(null)} />
  </div>
}

export function StructureScene({ scene, onFocus }: { scene: SceneState, onFocus: (id: string | null) => void }) {
  return <section id="structure" className={`${styles.scene} ${styles.structureScene}`}><div className={styles.stickyStructure}><div className={styles.structureHeading}><p>第二章 / 解构</p><h2>观其形<br />更解其构</h2><span>滚动不是翻页，而是逐步打开一套扣弦、瞄准与触发的关系。</span></div><WeaponExploder scene={scene} onFocus={onFocus} /></div></section>
}

export function AtmosphereLayer({ strength }: { strength: number }) { return <div className={styles.atmosphereLayer} style={{ opacity: 0.12 + strength * 0.35 }} aria-hidden="true" /> }

export function CraftScene({ globalProgress }: Pick<SceneState, 'globalProgress'>) {
  const [activeStage, setActiveStage] = useState(0)
  useEffect(() => { setActiveStage(Math.min(4, Math.max(0, Math.floor((globalProgress * 8) % 5)))) }, [globalProgress])
  return <section id="craft" className={`${styles.scene} ${styles.craftScene}`}>
    <div className={styles.craftImage} style={{ backgroundImage: `url(${assets.castingAtmosphere})` }} />
    <AtmosphereLayer strength={activeStage / 5} />
    <div className={styles.craftContent}><div className={styles.sceneHeading}><p>第三章 / 百炼</p><h2>器之成<br />非一日之功</h2><span>以下为青铜弩机的比较性工艺叙事，不能替代特定器物的检测记录。</span></div><ol className={styles.craftStages}>{craftStages.map(([num, title, description], index) => <li className={index === activeStage ? styles.craftActive : ''} key={num}><b>{num}</b><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div>
  </section>
}

export function TraceAnimation() { return <svg className={styles.traceSvg} viewBox="0 0 900 500" aria-hidden="true"><path d="M80 405 C230 360 320 112 554 158 S754 225 858 81" /><path d="M98 432 C298 371 372 154 629 210" /></svg> }

export function UsageScene() { return <section id="usage" className={`${styles.scene} ${styles.usageScene}`}><div className={styles.usageText}><p>第四章 / 入势</p><h2>器因人用<br />形随势生</h2><p>此处不模拟伤害。它只呈现器物结构如何与持握、瞄准、受力方向建立关系。</p></div><div className={styles.usageFigure}><img src={assets.figureLine} alt="抽象持弩人物线稿" /><TraceAnimation /><span className={styles.axisLabel}>LINE OF SIGHT</span><span className={styles.axisLabel}>TENSION / RELEASE</span></div></section> }

export function ArchiveItem({ source }: { source: SourceRecord }) { return <article className={styles.archiveItem}><p>{source.category}</p><h3>{source.title}</h3><cite>{source.citation}</cite><span>{source.note}</span>{source.url && <a href={source.url} target="_blank" rel="noreferrer">馆藏参照 ↗</a>}</article> }

export function ArchiveScene() { const categories = ['古籍语境', '考古材料', '机械解释', '比较性工艺', '馆藏参照'] as const; return <section id="archive" className={`${styles.scene} ${styles.archiveScene}`}><div className={styles.archiveHeading}><p>第五章 / 留痕</p><h2>让判断<br />回到证据</h2><span>沉浸在这里收束为可回查的知识线索。不同证据的力度与用途不应混为一谈。</span></div><div className={styles.archiveGrid}>{categories.map((category) => <div key={category} className={styles.archiveGroup}><h3>{category}</h3>{sources.filter((source) => source.category === category).map((source) => <ArchiveItem key={source.id} source={source} />)}</div>)}</div></section> }

export function CollectionScene({ explored }: { explored: boolean }) { const [stored, setStored] = useState(false); useEffect(() => { setStored(window.localStorage.getItem('qi-yu-collection-v1') === 'seen') }, []); useEffect(() => { if (explored) { window.localStorage.setItem('qi-yu-collection-v1', 'seen'); setStored(true) } }, [explored]); return <section id="collection" className={`${styles.scene} ${styles.collectionScene}`}><div className={styles.collectionStamp}>ARCHIVE / 001</div><div className={styles.collectionCard}><p>器藏 / 终章</p><h2>QY-CB-001</h2><h3>春秋战国青铜弩机<br /><small>CONCEPTUAL RESEARCH MODEL</small></h3><dl><div><dt>见形</dt><dd>已阅</dd></div><div><dt>解构</dt><dd>{explored ? '已探索' : '待探索'}</dd></div><div><dt>百炼</dt><dd>比较性流程</dd></div><div><dt>留痕</dt><dd>已归档</dd></div></dl><p className={styles.collectionNote}>{stored ? '本机探索记录已保存。' : '完成解构探索后，本机将保留阅读状态。'}</p></div><p className={styles.endingQuote}>“器物并未说完。<br />下一次凝视，是新的证据与问题。”</p></section> }
