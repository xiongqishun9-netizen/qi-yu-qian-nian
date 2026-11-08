import type { SourceRecord } from '../types/story'

export const sources: SourceRecord[] = [
  {
    id: 'sunzi', category: '古籍语境', title: '《孙子·势篇》',
    citation: '“势如彍弩，节如发机。”',
    note: '用于理解蓄势与触发的概念语境，不用于证明具体器物形制。',
  },
  {
    id: 'gao', category: '考古材料', title: '记长沙、常德出土弩机的战国墓',
    citation: '高至喜，《文物》1964 年第 6 期。',
    note: '以战国墓出土弩机、弓矢及木质遗存讨论装配关系。',
  },
  {
    id: 'chen', category: '考古材料', title: '江陵楚墓出土双矢并射连发弩研究',
    citation: '陈跃钧，《文物》1990 年第 5 期。',
    note: '特殊个案，不推断为战国弩的一般形制。',
  },
  {
    id: 'zhang', category: '机械解释', title: '古代弩机机械理论研究及其信息管理实现',
    citation: '张宝锋，西安理工大学硕士论文，2006。',
    note: '用现代机构学解释部件运动，是解释工具而非原始工艺记录。',
  },
  {
    id: 'yang', category: '比较性工艺', title: '中国古代青铜器凝固过程的数值模拟及其相关工艺问题研究',
    citation: '杨欢等，《文物保护与考古科学》34 卷 6 期，2022。',
    note: '为陶范铸造、凝固与铸后加工提供比较性框架。',
  },
  {
    id: 'museum', category: '馆藏参照', title: '汉世雄风：铜弩机',
    citation: '中国国家博物馆展览资料。',
    note: '用于参照郭、悬刀、钩心、牙、键和望山的组合说明；不作为本模型的单件归属。',
    url: 'https://www.chnmuseum.cn/Portals/0/web/exhibition/exhibitions/201812han/14.html',
  },
  {
    id: 'nmc-qin', category: '馆藏参照', title: '铜弩机（秦）',
    citation: '中国国家博物馆馆藏精品。',
    note: '馆藏页说明其无铜郭，由牙、钩、悬刀等组成；用于比较有郭、无郭形制。',
    url: 'https://www.chnmuseum.cn/zp/zpml/kgfjp/202110/t20211027_251877.shtml',
  },
  {
    id: 'met-han', category: '馆藏参照', title: 'Crossbow Trigger（汉）',
    citation: 'The Metropolitan Museum of Art，13.220.43a–f。',
    note: '馆藏图为 Public Domain；本项目仅将其作为较晚的汉代形制参照。',
    url: 'https://www.metmuseum.org/art/collection/search/61048',
  },
  {
    id: 'bmy-archer', category: '馆藏参照', title: '秦彩绘跪射俑',
    citation: '秦始皇帝陵博物院馆藏说明。',
    note: '博物院指出跪射俑位于二号坑弩兵阵中心，支持从单兵姿势扩展到编组视角。',
    url: 'https://bmy.com.cn/impor_collections/432.html',
  },
]
