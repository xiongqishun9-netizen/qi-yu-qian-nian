export interface GalleryObject {
  id: string
  title: string
  era: string
  museum: string
  image: string
  imageAlt: string
  form: string
  observation: string
  dimensions: string
  source: string
  imageCredit: string
}

export const galleryObjects: GalleryObject[] = [
  {
    id: 'qin-nmc', title: '铜弩机', era: '秦', museum: '中国国家博物馆',
    image: '/assets/weapons/gallery/nmc-qin-trigger.jpg',
    imageAlt: '中国国家博物馆铜弩机馆藏图，金属机件可见牙、钩与悬刀',
    form: '无郭式机件',
    observation: '国博说明这件铜弩机由牙、钩和悬刀组成，没有铜郭，以铜枢安装在木臂框槽中。它提示我们：并非所有弩机都有同一种外壳。',
    dimensions: '馆藏页面未公布尺寸',
    source: 'https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211027_251877.shtml',
    imageCredit: '图片：中国国家博物馆',
  },
  {
    id: 'han-hebei', title: '铜弩机', era: '西汉', museum: '河北博物院藏 · 国博展览图',
    image: '/assets/weapons/gallery/nmc-han-trigger.jpg',
    imageAlt: '河北博物院藏西汉铜弩机，郭、望山与金属轴件可见',
    form: '有郭式机件',
    observation: '国博“汉世雄风”展览记述刘胜墓出土的弩机：郭、悬刀、钩心、牙、键组合成整体，部分望山带刻度。这是较晚的汉代参照，不直接代表战国弩机。',
    dimensions: '长 9.5 厘米',
    source: 'https://www.chnmuseum.cn/Portals/0/web/exhibition/exhibitions/201812han/14.html',
    imageCredit: '图片：中国国家博物馆展览页；馆藏：河北博物院',
  },
  {
    id: 'han-met', title: 'Crossbow Trigger', era: '汉代', museum: '大都会艺术博物馆',
    image: '/assets/weapons/gallery/met-han-trigger.jpg',
    imageAlt: '大都会艺术博物馆藏汉代青铜弩机侧面馆藏图',
    form: '有郭式机件 · 侧面观察',
    observation: '馆藏号 13.220.43a–f。照片清楚呈现郭体、竖立部件与侧面轴件的空间关系；其名称及年代以馆藏记录为准。',
    dimensions: '长 13.7 × 宽 6 × 高 17.1 厘米',
    source: 'https://www.metmuseum.org/art/collection/search/61048',
    imageCredit: '图片：The Metropolitan Museum of Art，Public Domain',
  },
]
