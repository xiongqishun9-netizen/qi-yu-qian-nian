# 器语千年

> 中国古代器物数字叙事 · 春秋战国青铜弩机概念研究模型

本地 React/Vite 单页原型。体验采用六幕固定画幅的逐步叙事：序·入卷、见形、解构、百炼、入势、器藏。滚轮、方向键、点击和触屏手势逐幕推进；馆藏图廊、解构、工艺和使用研究各有幕内阶段。

## 启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 交互

- 首页可见的 `START` 按钮进入展览；方向键、空格、鼠标滚轮或屏幕下方按钮逐步推进。
- 见形章节横向浏览三件真实馆藏图；点击图像打开年代、形制、尺寸与馆藏来源档案。横向滚轮、左右按钮和触屏横扫可切换。
- 章节导航可直接跳转。解构幕里的阶段标记切换整体、结构线、部件分离和编号状态。
- 解构部件支持点击、Tab 聚焦与 Enter 查看说明；`Escape` 退出聚焦。
- 百炼的五个工艺节点可点选，也能用方向键或滚轮逐步切换。
- 入势从单兵持握、张弦方式比较，推进到军阵编组的研究视角。画面是生成式情境插画，旁列官方资料链接。
- 器藏中的部件标签可返回对应部件说明；探索状态保存在浏览器 `localStorage`。

## 学术边界

`QY-CB-001` 是基于专题资料汇编中的部件术语与机构关系绘制的**概念研究模型**，不对应任何单件出土器的精确复原。陶范铸造与铸后加工按比较性工艺呈现；“入势”说明人与器物及队列的关系，不模拟战斗、伤害或射击。生成式图像只承担氛围和叙事，不作为文物证据；真实馆藏照片在第一章明确标出来源与时代。

## 项目结构

```text
src/
  components/ProgressiveStory.tsx        固定舞台、章节与交互
  components/ProgressiveStory.module.css 画面与响应式样式
  data/                                  器物、章节、来源和素材数据
  types/                                 领域数据结构
public/assets/
  backgrounds/                           章节主视觉
  craft/                                 工艺氛围图
  figures/                               持握关系壁画插画
  weapons/gallery/                       馆藏实物图片
  textures/                              档案纸纹
docs/                                    参考分析、素材指南、内容结构和 QA
```

详见 [馆藏图片来源](docs/MUSEUM_GALLERY.md)、[素材替换指南](docs/ASSET_GUIDE.md)、[内容结构](docs/CONTENT_SCHEMA.md)、[参考分析](docs/reference-analysis.md) 与 [设计 QA](design-qa.md)。
