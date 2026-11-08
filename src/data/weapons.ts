import type { WeaponRecord } from '../types/story'

export const bronzeTrigger: WeaponRecord = {
  id: 'QY-CB-001',
  title: '春秋战国青铜弩机',
  subtitle: 'CONCEPTUAL RESEARCH MODEL',
  era: '战国时期 · 结构术语研究',
  material: '青铜、木质构件（推定的完整弩语境）',
  verified: false,
  description:
    '本模型基于已整理资料中的部件术语与机构关系绘制，用于解释扣弦、瞄准与触发的基本逻辑；不对应任何单件出土器的精确复原。',
  parts: [
    {
      id: 'body', number: '01', name: '郭', english: 'FRAME', material: '青铜',
      function: '承载并包容内部机件，提供箭槽与部件安装关系。', source: '资料汇编：完整弩与青铜弩机结构', verification: 'to-verify',
    },
    {
      id: 'tooth', number: '02', name: '牙', english: 'SEAR', material: '青铜',
      function: '扣住弓弦，并在触发时释放其蓄积的张力。', source: '资料汇编：机构运动关系', verification: 'to-verify',
    },
    {
      id: 'sight', number: '03', name: '望山', english: 'SIGHT', material: '青铜',
      function: '构成瞄准的观察基准；具体高度与刻度需对应具体器物核验。', source: '国家博物馆与资料汇编', verification: 'comparative',
    },
    {
      id: 'trigger', number: '04', name: '悬刀', english: 'TRIGGER', material: '青铜',
      function: '作为触发部件，带动内部结构解除闭锁。', source: '资料汇编：机构运动关系', verification: 'to-verify',
    },
    {
      id: 'pin', number: '05', name: '轴销 / 键', english: 'PIN / KEY', material: '青铜',
      function: '维持部件相对位置并承担转动或组合关系。', source: '资料汇编与馆藏参照', verification: 'comparative',
    },
  ],
}
