# 内容与资料结构

所有可陈述的器物知识都应存放在 `src/data/`，而不是写进场景组件。

## 核心类型

```ts
WeaponRecord: {
  id, title, subtitle, era, material, description, verified, parts
}

PartRecord: {
  id, number, name, english, material, function, source, verification
}

SourceRecord: {
  id, category, title, citation, note, url?
}

ChapterRecord: { id, label, title, quote }
AssetManifest: { prologueAtmosphere, castingAtmosphere, paperNoise, figureLine }
```

## 资料状态

- `verified`：可直接回查到已确认的资料、图版或馆藏信息。
- `to-verify`：名称或解释用于原型，仍需以具体器物图版、尺寸或报告核验。
- `comparative`：用于建立比较参照，不能直接推断为当前模型的单件事实。

## 页面数据原则

1. 古籍说明历史语境，不单独推导器物年代、范制或尺寸。
2. 机械解释说明运动关系，不代替考古证据。
3. 青铜铸造研究在本项目中属于比较性工艺框架。
4. 新增内容先补充 `sources.ts`，再关联至部件或章节；没有来源的内容显示“资料待考证”。
