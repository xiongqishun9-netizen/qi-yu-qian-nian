# 素材替换指南

## 当前素材结构

| 分类 | 当前文件 | 用途 | 是否可作为事实证据 |
| --- | --- | --- | --- |
| `backgrounds` | `prologue-atmosphere-v2.png` | 序章气氛底图 | 否 |
| `backgrounds` | `opening-art-clean.png` | 序章主视觉的无字版本；标题与 START 由 HTML 实现 | 否；生成式概念图 |
| `backgrounds` | `opening-direction-02.png` | 初版视觉方向图，解构背景质感 | 否；生成图中包含概念造型 |
| `backgrounds` | `opening-mobile.png` | 竖屏序章气氛底图，网页标题独立叠加 | 否；生成式氛围图 |
| `craft` | `casting-atmosphere.png` | 工艺章节气氛底图 | 否 |
| `textures` | `paper-noise.svg` | 全局纸纤维噪点 | 否 |
| `figures` | `usage-mural.png` | 入势章节的持握关系氛围插画 | 否；生成式插画，不作考古复原 |
| `figures` | `usage-methods.png`、`usage-formation.png` | 使用方式比较及军阵视角 | 否；生成式情境插画 |
| `weapons/gallery` | 三张馆藏图 | 第一章横向馆藏图廊 | 是馆藏图像；应连同馆藏元数据阅读，详见 `MUSEUM_GALLERY.md` |
| `figures` | `usage-figure.svg` | 早期抽象线稿，当前版本未启用 | 否 |
| `weapons` | 组件内分层 SVG | 可交互青铜弩机概念模型 | 仅作解释模型 |

## 如何替换 2.5D 图层

1. 在 Photoshop 中将一张完整视觉拆为 `foreground`、`midground`、`background`、`atmosphere`、`subject`、`detail` 六层。
2. 每层导出透明 PNG；近景保留较高分辨率，雾、纸粒、测绘线优先导出为轻量 WebP/PNG。
3. 放入对应的 `public/assets/` 子目录，不要散落在组件目录。
4. 氛围素材在 `src/data/assets.ts` 更新路径；馆藏图片与形制档案在 `src/data/gallery.ts` 更新。
5. 若替换真实文物图像，同时更新 `src/data/gallery.ts`、`src/data/sources.ts` 和 `docs/MUSEUM_GALLERY.md` 的馆藏、授权和资料状态。

## 如何替换弩机结构

当前结构由 `WeaponLayer` 中五个独立 SVG 组表现：郭、牙、望山、悬刀、轴销/键。若获得具有授权的测绘资料：

1. 先按部件导出各自透明 SVG 或 PNG。
2. 为每个部件保留同一个局部坐标系，避免滚动分离时错位。
3. 在 `src/data/weapons.ts` 核验名称、材料、功能、年代、尺寸与来源。
4. 若是特定出土器，必须将“概念研究模型”改为馆藏/发掘信息，并标出来源与授权边界。

## 影像性能

- 首屏背景建议控制在 2600px 宽以内、单张低于 1.5MB；当前为概念稿，可在交付前转成 WebP。
- 非首屏背景使用 `loading="lazy"` 或 CSS 延迟载入策略。
- 不要在透明图层中重复嵌入纸纹，纸纹已由全局 SVG 提供。
