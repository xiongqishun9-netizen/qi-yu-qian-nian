import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { chapters } from '../data/chapters'
import { sources } from '../data/sources'
import { bronzeTrigger } from '../data/weapons'
import { assets } from '../data/assets'
import { galleryObjects } from '../data/gallery'
import type { PartRecord } from '../types/story'
import styles from './ProgressiveStory.module.css'

const structureSteps = [
  { title: '合 · 整体', note: '先看见弩机作为一个整体，郭与机件共同构成扣弦、瞄准和触发的关系。' },
  { title: '显 · 结构线', note: '结构线提示金属机件之间的相对位置；它是研究模型的解释层，不是器物表面纹饰。' },
  { title: '分 · 机件', note: '郭、牙、望山、悬刀与轴销逐步分离，便于观察各部件的关联。' },
  { title: '读 · 编号', note: '选择任一部件查看功能、材料与证据状态。不同器物之间的形制可能存在差异。' },
]

const crafts = [
  ['01', '分件与构思', '先确定机件组合、受力关系与装配次序。具体器物的设计过程仍需结合出土记录判断。'],
  ['02', '制模与制范', '陶范铸造是青铜器生产的重要路径之一；这里呈现比较性工艺，不指认某一件弩机。'],
  ['03', '浇注与凝固', '金属液进入范腔后冷却成形，范料、浇道与铸造条件影响最终结果。'],
  ['04', '清理与加工', '清理浇口、修整表面，并对孔、轴等配合位置进行加工。'],
  ['05', '装配与调试', '各部件以轴销或键等关系组合；此处为结构逻辑示意，不代表具体复原尺寸。'],
]

const usageSteps = [
  { title: '单兵 · 持握与观察', label: '01 / 单兵', image: assets.usageMural,
    description: '从一个人的持握姿态开始，观察弩臂、弩机与视线如何在使用时相遇。画面为解释性插画。',
    evidence: '结构—人体关系的研究示意；具体姿势仍需结合俑像与器物资料。' },
  { title: '张弦 · 方式有别', label: '02 / 方法', image: assets.usageMethods,
    description: '国博资料将早期弩的张弦方式概括为手臂、脚踏与腰引等。不同方式意味着器物尺度和使用姿态有差异。',
    evidence: '分类依据：中国国家博物馆《铜弩机》；插画只比较姿态，不复原操作步骤。' },
  { title: '军阵 · 多人协同', label: '03 / 队列', image: assets.usageFormation,
    description: '视角从单人移向队列：秦兵马俑坑的弓弩手形象提示弩在群体编组中的位置，具体阵法仍需更多材料佐证。',
    evidence: '军阵图为生成式情境插画；依据见秦始皇帝陵博物院与相关考古解读。' },
]

function PartDetail({ part, onClose }: { part: PartRecord | undefined; onClose: () => void }) {
  if (!part) return <div className={styles.partHint}><span>点选器件</span><small>或用 Tab 聚焦 · Enter 查看结构档案</small></div>
  return <aside className={styles.partDetail} aria-live="polite">
    <button className={styles.closeDetail} onClick={onClose} aria-label="关闭部件信息">×</button>
    <p className={styles.detailIndex}>机件档案 / {part.number}</p>
    <h3>{part.name}<small>{part.english}</small></h3>
    <dl><div><dt>结构关系</dt><dd>{part.function}</dd></div><div><dt>材质判断</dt><dd>{part.material}</dd></div><div><dt>依据线索</dt><dd>{part.source}</dd></div></dl>
    <span className={styles.evidenceBadge}>{part.verification === 'verified' ? '资料已核验' : part.verification === 'comparative' ? '比较性参照' : '资料待考证'}</span>
  </aside>
}

export function ProgressiveStory() {
  const [active, setActive] = useState(0)
  const [structureProgress, setStructureProgress] = useState(0)
  const [activePart, setActivePart] = useState<string | null>(null)
  const [craftStep, setCraftStep] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryDetail, setGalleryDetail] = useState<number | null>(null)
  const [usageStep, setUsageStep] = useState(0)
  const [visited, setVisited] = useState<number[]>([0])
  const [saved, setSaved] = useState(false)
  const wheelLock = useRef(false)
  const touchStart = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const galleryViewport = useRef<HTMLDivElement | null>(null)
  const activePartRecord = bronzeTrigger.parts.find((part) => part.id === activePart)

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, index))
    setActive(next)
    setVisited((old) => old.includes(next) ? old : [...old, next])
    setActivePart(null)
    setGalleryDetail(null)
    if (next === 2 && !visited.includes(2)) setStructureProgress(0)
    if (next === 3 && !visited.includes(3)) setCraftStep(0)
    if (next === 4 && !visited.includes(4)) setUsageStep(0)
  }, [visited])

  useEffect(() => {
    const viewport = galleryViewport.current
    const card = viewport?.querySelectorAll<HTMLElement>('[data-gallery-card]')[galleryIndex]
    if (!viewport || !card) return
    viewport.scrollTo({ left: card.offsetLeft - viewport.querySelector<HTMLElement>('[data-gallery-card]')!.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [galleryIndex])

  const advance = useCallback((direction: 1 | -1) => {
    if (active === chapters.length - 1 && direction > 0) { goTo(0); return }
    if (active === 1 && galleryDetail !== null) { setGalleryDetail(null); return }
    if (direction > 0 && active === 1 && galleryIndex < galleryObjects.length - 1) {
      setGalleryIndex((value) => value + 1)
      return
    }
    if (direction < 0 && active === 1 && galleryIndex > 0) {
      setGalleryIndex((value) => value - 1)
      return
    }
    if (direction > 0 && active === 2 && structureProgress < 1) {
      setStructureProgress((value) => Math.min(1, Number((value + 0.25).toFixed(2))))
      return
    }
    if (direction < 0 && active === 2 && structureProgress > 0) {
      setStructureProgress((value) => Math.max(0, Number((value - 0.25).toFixed(2))))
      return
    }
    if (direction > 0 && active === 3 && craftStep < crafts.length - 1) {
      setCraftStep((value) => Math.min(crafts.length - 1, value + 1))
      return
    }
    if (direction < 0 && active === 3 && craftStep > 0) {
      setCraftStep((value) => Math.max(0, value - 1))
      return
    }
    if (direction > 0 && active === 4 && usageStep < usageSteps.length - 1) {
      setUsageStep((value) => value + 1)
      return
    }
    if (direction < 0 && active === 4 && usageStep > 0) {
      setUsageStep((value) => value - 1)
      return
    }
    goTo(active + direction)
  }, [active, craftStep, galleryDetail, galleryIndex, goTo, structureProgress, usageStep])

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { setActivePart(null); setGalleryDetail(null); return }
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); if (!event.repeat) advance(1) }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); if (!event.repeat) advance(-1) }
      if (event.key === 'Home') goTo(0)
      if (event.key === 'End') goTo(chapters.length - 1)
    }
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = active === 1 && Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(delta) < 18 || wheelLock.current) return
      wheelLock.current = true
      window.setTimeout(() => { wheelLock.current = false }, 700)
      advance(delta > 0 ? 1 : -1)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('wheel', onWheel) }
  }, [advance, goTo])

  useEffect(() => {
    if (active === chapters.length - 1) {
      const explored = visited.includes(2) && structureProgress > 0.5
      if (explored) { localStorage.setItem('qi-yu-collection-v1', 'seen'); setSaved(true) }
    }
  }, [active, structureProgress, visited])

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return
    const delta = touchStart.current - event.changedTouches[0].clientY
    const deltaX = touchStartX.current === null ? 0 : touchStartX.current - event.changedTouches[0].clientX
    if (active === 1 && Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(delta)) {
      setGalleryIndex((value) => Math.max(0, Math.min(galleryObjects.length - 1, value + (deltaX > 0 ? 1 : -1))))
      touchStart.current = null
      touchStartX.current = null
      return
    }
    if (Math.abs(delta) > 48) advance(delta > 0 ? 1 : -1)
    touchStart.current = null
    touchStartX.current = null
  }

  const focusPart = (id: string) => setActivePart((current) => current === id ? null : id)
  const partTransform = (id: string) => {
    const factor = Math.max(0, (structureProgress - 0.18) / 0.82)
  const positions: Record<string, [number, number, number]> = { body: [0, 0, 0], tooth: [-170, 72, 42], sight: [28, -166, 70], trigger: [205, 96, 92], pin: [153, -58, 125] }
    const [x, y, z] = positions[id]
    return `translate3d(${x * factor}px, ${y * factor}px, ${z * factor}px)`
  }

  return <main className={`${styles.story} ${active === 1 ? styles.lightUi : ''}`} onTouchStart={(event) => { touchStart.current = event.touches[0].clientY; touchStartX.current = event.touches[0].clientX }} onTouchEnd={handleTouchEnd}>
    <header className={styles.topbar}><button type="button" className={styles.brand} onClick={() => goTo(0)} aria-label="回到展览开篇"><span className={styles.brandSeal}>器</span><span>器语千年<small>OBJECTS SPEAK THROUGH TIME</small></span></button><p className={styles.topMeta}>数字文化展览 <i /> 春秋战国青铜弩机</p><span className={styles.soundState}>研究性概念模型</span></header>
    <nav className={styles.chapterNav} aria-label="叙事章节">
      {chapters.map((chapter, index) => <button key={chapter.id} className={`${styles.chapterDot} ${active === index ? styles.chapterCurrent : ''} ${visited.includes(index) ? styles.chapterVisited : ''}`} onClick={() => goTo(index)} aria-label={`前往${chapter.title}`} aria-current={active === index ? 'step' : undefined}><span>{chapter.label}</span><b>{chapter.title}</b></button>)}
    </nav>
    <div className={styles.progressTrack} aria-hidden="true"><i style={{ transform: `scaleX(${(active + (active === 1 ? galleryIndex / (galleryObjects.length - 1) : active === 2 ? structureProgress : active === 3 ? craftStep / (crafts.length - 1) : active === 4 ? usageStep / (usageSteps.length - 1) : 0)) / (chapters.length - 1)})` }} /></div>
    <div className={styles.frameCounter}>{String(active + 1).padStart(2, '0')} <span>/</span> {String(chapters.length).padStart(2, '0')}</div>

    <section id="intro" className={`${styles.scene} ${styles.intro} ${active === 0 ? styles.sceneActive : ''}`} aria-hidden={active !== 0}>
      <picture className={styles.introPicture}><source media="(max-width: 600px)" srcSet={assets.prologueMobile} /><img className={styles.introImage} src={assets.prologueClean} alt="赭色纸本上的概念青铜机件与考古风格图稿" /></picture>
      <div className={styles.introShade} />
      <div className={styles.introContent}><p>青铜弩机 · 数字文化展览</p><h1>器语千年</h1><span>THE LANGUAGE OF ANCIENT OBJECTS</span><button className={styles.startButton} onClick={() => goTo(1)}>START <b aria-hidden="true">→</b><small>进入展卷</small></button><p className={styles.introPromise}>从馆藏实物出发，逐步见形、解构、追问造物与使用。</p></div>
      <p className={styles.introCredit}>基于现有资料构建的概念研究模型 <span>·</span> QY-CB-001</p>
    </section>

    <section className={`${styles.scene} ${styles.formScene} ${active === 1 ? styles.sceneActive : ''}`} aria-hidden={active !== 1}>
      <div className={styles.formBackground} style={{ backgroundImage: `url(${assets.prologueAtmosphere})` }} />
      <div className={styles.formWash} />
      <div className={styles.galleryHeading}><p className={styles.kicker}>第一章 / 见形</p><h1>先看实物，<em>再问其形</em></h1><p>横向浏览三件馆藏弩机。点击图像，辨认它们的年代、结构与差异。</p></div>
      <div className={styles.galleryViewport} ref={galleryViewport} aria-label="馆藏弩机横向图廊"><div className={styles.galleryTrack}>
        {galleryObjects.map((item, index) => <button type="button" data-gallery-card className={`${styles.galleryCard} ${galleryIndex === index ? styles.galleryCardActive : ''}`} key={item.id} onClick={() => { setGalleryIndex(index); setGalleryDetail(index) }} aria-label={`查看${item.museum}${item.title}的形制资料`}>
          <div className={styles.galleryImage}><img src={item.image} alt={item.imageAlt} /></div><div className={styles.galleryCardText}><span>{String(index + 1).padStart(2, '0')} / {item.era}</span><h3>{item.title}</h3><p>{item.museum} · {item.form}</p><b>点开形制档案 ↗</b></div>
        </button>)}
      </div></div>
      <div className={styles.galleryNav}><button onClick={() => setGalleryIndex((value) => Math.max(0, value - 1))} disabled={galleryIndex === 0} aria-label="上一件馆藏">←</button><span>{String(galleryIndex + 1).padStart(2, '0')} / {String(galleryObjects.length).padStart(2, '0')}</span><button onClick={() => setGalleryIndex((value) => Math.min(galleryObjects.length - 1, value + 1))} disabled={galleryIndex === galleryObjects.length - 1} aria-label="下一件馆藏">→</button><small>滚轮 / 横向滑动继续浏览</small></div>
      {galleryDetail !== null && <div className={styles.galleryOverlay} role="dialog" aria-modal="true" aria-label={`${galleryObjects[galleryDetail].title}形制档案`}><div className={styles.galleryDialog}><button className={styles.galleryClose} onClick={() => setGalleryDetail(null)} aria-label="关闭形制档案">×</button><img src={galleryObjects[galleryDetail].image} alt={galleryObjects[galleryDetail].imageAlt} /><div><p className={styles.kicker}>馆藏形制 / {galleryObjects[galleryDetail].era}</p><h2>{galleryObjects[galleryDetail].title}</h2><strong>{galleryObjects[galleryDetail].form}</strong><p>{galleryObjects[galleryDetail].observation}</p><dl><div><dt>馆藏</dt><dd>{galleryObjects[galleryDetail].museum}</dd></div><div><dt>尺寸</dt><dd>{galleryObjects[galleryDetail].dimensions}</dd></div></dl><small>{galleryObjects[galleryDetail].imageCredit}</small><a href={galleryObjects[galleryDetail].source} target="_blank" rel="noreferrer">查看馆藏原始页面 ↗</a></div></div></div>}
    </section>

    <section className={`${styles.scene} ${styles.structureScene} ${active === 2 ? styles.sceneActive : ''}`} aria-hidden={active !== 2}>
      <div className={styles.structureAtmosphere} style={{ backgroundImage: `url(${assets.castingAtmosphere})` }} />
      <div className={styles.structureVeil} />
      <div className={styles.sceneTitle}><p className={styles.kicker}>第二章 / 解构</p><h2>观其形，<br /><em>更解其构</em></h2><p>滚动或按键，逐步展开机件关系</p></div>
      <div className={styles.mechanismStage}>
        <div className={styles.mechanismImage} style={{ backgroundImage: 'url(/assets/backgrounds/opening-direction-02.png)' }} />
        <svg viewBox="-360 -240 720 480" className={styles.mechanismSvg} role="group" aria-label="可交互的青铜弩机概念模型">
          <defs><linearGradient id="bronzeMetal" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#a38b62"/><stop offset=".45" stopColor="#52685e"/><stop offset="1" stopColor="#25332f"/></linearGradient><filter id="objectShadow"><feGaussianBlur stdDeviation="12"/></filter></defs>
          <ellipse cx="0" cy="102" rx="270" ry="34" fill="#090a08" opacity=".78" filter="url(#objectShadow)" />
          {bronzeTrigger.parts.map((part) => {
            const faded = activePart && activePart !== part.id
            const common = { role: 'button' as const, tabIndex: 0, 'aria-label': `${part.name}：${part.function}`, onClick: () => focusPart(part.id), onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); focusPart(part.id) } }, className: `${styles.metalPart} ${faded ? styles.metalFaded : ''} ${activePart === part.id ? styles.metalSelected : ''}`, style: { transform: partTransform(part.id) } }
            const surface = { fill: 'url(#bronzeMetal)', stroke: '#b9aa86', strokeWidth: 3, strokeLinejoin: 'round' as const }
            if (part.id === 'body') return <g key={part.id} {...common}><path {...surface} d="M-278 -42 L-170 -94 L82 -94 L225 -34 L226 27 L104 64 L-140 66 L-282 29 Z"/><path d="M-170 -37 L77 -37 L151 -13 L76 5 L-174 6 Z" fill="none" stroke="#d0bd91" strokeWidth="4" opacity=".7"/><path d="M-249 -28 L-220 -60 M178 -26 L207 -15 M-100 34 L114 34" stroke="#24312c" strokeWidth="5" opacity=".7"/></g>
            if (part.id === 'tooth') return <g key={part.id} {...common}><path {...surface} d="M-52 -79 L17 -79 L42 -23 L23 34 L-30 34 L-53 -12 Z"/><path d="M-12 -78 L11 -31 L-10 -5Z" fill="none" stroke="#ded0ae" strokeWidth="4"/></g>
            if (part.id === 'sight') return <g key={part.id} {...common}><path {...surface} d="M30 -153 L87 -153 L105 -64 L50 -48 L22 -74 Z"/><path d="M49 -135 L71 -135 M46 -112 L76 -112 M43 -90 L82 -90" stroke="#e5d4af" strokeWidth="4"/></g>
            if (part.id === 'trigger') return <g key={part.id} {...common}><path {...surface} d="M147 -13 L194 3 L209 103 L175 133 L143 105 L154 42 Z"/><path d="M176 22 L174 96" fill="none" stroke="#dacaa4" strokeWidth="5"/></g>
            return <g key={part.id} {...common}><circle {...surface} cx="82" cy="2" r="23"/><circle cx="82" cy="2" r="8" fill="#161b18" stroke="#d4c39a" strokeWidth="3"/></g>
          })}
          {structureProgress > .65 && bronzeTrigger.parts.map((part, index) => <g className={styles.partNumber} key={`number-${part.id}`}><circle cx={-282 + index * 140} cy="-192" r="16"/><text x={-282 + index * 140} y="-187">{part.number}</text></g>)}
        </svg>
        <div className={`${styles.structureRays} ${structureProgress > .2 ? styles.raysVisible : ''}`} />
        {structureProgress > .42 && <div className={styles.detailLabel}>{structureSteps[Math.min(3, Math.floor(structureProgress * 4))].title}<span> / EXPLODED VIEW</span></div>}
      </div>
      <div className={styles.structureFooter}><span>QY-CB-001　概念结构模型</span><div className={styles.stepPips}>{structureSteps.map((item, i) => <button key={item.title} className={i <= Math.round(structureProgress * 3) ? styles.pipOn : ''} onClick={() => setStructureProgress(i / 3)} aria-label={`结构阶段：${item.title}`} />)}</div><span>{String(Math.round(structureProgress * 100)).padStart(2, '0')}%</span></div>
      <PartDetail part={activePartRecord} onClose={() => setActivePart(null)} />
      <p className={styles.structureDisclaimer}>研究性概念模型 · 部件关系用于解释，不对应特定出土器的精确复原</p>
    </section>

    <section className={`${styles.scene} ${styles.craftScene} ${active === 3 ? styles.sceneActive : ''}`} aria-hidden={active !== 3}>
      <div className={styles.craftBackdrop} style={{ backgroundImage: `url(${assets.castingAtmosphere})` }} /><div className={styles.craftGradient} />
      <div className={styles.craftHeader}><p className={styles.kicker}>第三章 / 百炼</p><h2>火与土之间，<br /><em>器成于手</em></h2><p>陶范铸造与铸后加工的比较性流程</p></div>
      <div className={styles.craftNumbers}>{crafts.map((item, i) => <button key={item[0]} className={craftStep === i ? styles.craftNumberActive : ''} onClick={() => setCraftStep(i)}>{item[0]}</button>)}</div>
      <article className={styles.craftFeature} key={craftStep}><span>{crafts[craftStep][0]} / 05</span><h3>{crafts[craftStep][1]}</h3><p>{crafts[craftStep][2]}</p><div className={styles.craftLine}><i style={{ width: `${((craftStep + 1) / crafts.length) * 100}%` }} /></div></article>
      <p className={styles.craftDisclaimer}>比较性工艺叙事 · 不代表某一件弩机的检测记录</p>
    </section>

    <section className={`${styles.scene} ${styles.usageScene} ${active === 4 ? styles.sceneActive : ''}`} aria-hidden={active !== 4}>
      <div className={styles.usagePaper} />
      {usageSteps.map((step, index) => <div key={step.title} className={`${styles.usageLayer} ${usageStep === index ? styles.usageLayerActive : ''}`} style={{ backgroundImage: `url(${step.image})` }} aria-hidden={usageStep !== index} />)}
      <div className={styles.usageShade} />
      <div className={styles.usageCopy}><p className={styles.kicker}>第四章 / 入势</p><h2>{usageSteps[usageStep].title.split(' · ')[0]} ·<br />{usageSteps[usageStep].title.split(' · ')[1]}</h2><p>{usageSteps[usageStep].description}</p><div className={styles.usageStageList}>{usageSteps.map((step, index) => <button className={usageStep === index ? styles.usageStageActive : ''} onClick={() => setUsageStep(index)} key={step.title} aria-current={usageStep === index ? 'step' : undefined}><span>{step.label}</span><b>{step.title}</b></button>)}</div></div>
      <div className={styles.usageSource}><span>研究依据 / {String(usageStep + 1).padStart(2, '0')}</span><p>{usageSteps[usageStep].evidence}</p><a href={usageStep === 1 ? 'https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211027_251877.shtml' : 'https://bmy.com.cn/impor_collections/432.html'} target="_blank" rel="noreferrer">查阅相关馆藏资料 ↗</a></div>
      <p className={styles.usageCaption}>图像为生成式情境插画，不代表特定时代军阵的精确复原。</p>
    </section>

    <section className={`${styles.scene} ${styles.collectionScene} ${active === 5 ? styles.sceneActive : ''}`} aria-hidden={active !== 5}>
      <div className={styles.collectionImage} style={{ backgroundImage: `url(${assets.prologueAtmosphere})` }} /><div className={styles.collectionVeil} />
      <div className={styles.collectionLeft}><p className={styles.kicker}>器藏 / 数字档案</p><h2>QY-CB-<br /><em>001</em></h2><p>一件概念模型，<br />也是一条继续追问的线索。</p><button className={styles.restartButton} onClick={() => { setStructureProgress(0); setCraftStep(0); goTo(0) }}>重新展阅 <span>↺</span></button></div>
      <div className={styles.archiveCard}><div className={styles.archiveCardHeader}><span>COLLECTION NO.</span><b>001</b></div><h3>{bronzeTrigger.title}</h3><p>{bronzeTrigger.subtitle}</p><dl><div><dt>时代范围</dt><dd>{bronzeTrigger.era}</dd></div><div><dt>材质记录</dt><dd>{bronzeTrigger.material}</dd></div><div><dt>模型状态</dt><dd>研究性概念模型</dd></div><div><dt>探索记录</dt><dd>{saved ? '已保存于本机' : '本机浏览中'}</dd></div></dl><div className={styles.archiveParts}>{bronzeTrigger.parts.map((part) => <button onClick={() => { goTo(2); setStructureProgress(1); setActivePart(part.id) }} key={part.id}>{part.number}<span>{part.name}</span><b>↗</b></button>)}</div><small>{bronzeTrigger.description}</small><div className={styles.collectionSources}>{sources.filter((source) => source.url).slice(0, 3).map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.title} ↗</a>)}</div></div>
      <p className={styles.endingQuote}>“器物未曾说完。<br />下一次凝视，是新的证据与问题。”</p>
    </section>

    <footer className={styles.controls}><button onClick={() => advance(-1)} disabled={active === 0} aria-label="上一幕">← <span>{active === 1 && galleryIndex > 0 ? '上一件' : active === 4 && usageStep > 0 ? '上一研究视角' : '上一幕'}</span></button><div className={styles.controlHint}>滚轮 / ← → 键 / 点击章节 <i>·</i> 逐幕前行</div><button onClick={() => advance(1)} aria-label={active === chapters.length - 1 ? '回到开篇' : '继续探索'}>{active === chapters.length - 1 ? '↺' : '→'} <span>{active === chapters.length - 1 ? '再看一次' : active === 1 && galleryIndex < galleryObjects.length - 1 ? '下一件馆藏' : active === 2 && structureProgress < 1 ? '继续解构' : active === 3 && craftStep < 4 ? '下一工序' : active === 4 && usageStep < usageSteps.length - 1 ? '下一研究视角' : '下一幕'}</span></button></footer>
  </main>
}
