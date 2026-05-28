# 视觉设计系统

## 📐 设计原则

### 1. 遵循 iOS HIG
严格遵循 Apple Human Interface Guidelines，确保应用在 iOS 设备上的原生体验。

### 2. 简洁直观
- 信息层级清晰，重要内容突出
- 操作流程简短，减少用户思考
- 符合 iOS 原生交互习惯

### 3. 统一性
- 全局视觉风格统一
- 组件样式复用一致
- 交互行为保持一致

### 4. 可访问性
- 支持动态字体缩放
- 深色模式完整适配
- VoiceOver 友好支持

---

## 🎨 色彩系统

### 主色调

```dart
// 品牌主色 - 珊瑚红
primary: 0xFFFF6B6B
primaryLight: 0xFFFF8E8E
primaryDark: 0xFFE55555
```

### 功能色

| 颜色 | 色值 | 用途 |
|------|------|------|
| 系统红 | `CupertinoColors.systemRed` | 错误、警告 |
| 系统绿 | `CupertinoColors.systemGreen` | 成功、正向 |
| 系统蓝 | `CupertinoColors.systemBlue` | 链接、强调 |
| 系统橙 | `CupertinoColors.systemOrange` | 注意、提醒 |
| 系统黄 | `CupertinoColors.systemYellow` | 警示 |

### 中性色

```dart
// 浅色模式
textPrimary: 0xFF000000      // 主文本 (opacity: 0.85)
textSecondary: 0xFF000000    // 次要文本 (opacity: 0.65)
textTertiary: 0xFF000000     // 提示文本 (opacity: 0.45)
textQuaternary: 0xFF000000    // 占位符 (opacity: 0.18)

background: 0xFFF2F2F7       // 页面背景
surface: 0xFFFFFFFF          // 卡片背景
divider: 0xFFC6C6C8          // 分割线

// 深色模式
darkTextPrimary: 0xFFFFFFFF
darkTextSecondary: 0xFFFFFFFF
darkBackground: 0xFF000000
darkSurface: 0xFF1C1C1E
darkDivider: 0xFF38383A
```

---

## ✏️ 字体系统

### iOS 系统字体

使用 SF Pro 字体家族，遵循 iOS 字体层级：

| 风格 | 字号 | 字重 | 用途 |
|------|------|------|------|
| largeTitle | 34pt | Bold (700) | 大标题 |
| title1 | 28pt | Bold (700) | 一级标题 |
| title2 | 22pt | SemiBold (600) | 二级标题 |
| title3 | 20pt | SemiBold (600) | 三级标题 |
| headline | 17pt | SemiBold (600) | 栏标题 |
| body | 17pt | Regular (400) | 正文 |
| callout | 16pt | Regular (400) | 标注 |
| subheadline | 15pt | Regular (400) | 副标题 |
| footnote | 13pt | Regular (400) | 脚注 |
| caption1 | 12pt | Regular (400) | 说明 |
| caption2 | 11pt | Regular (400) | 小说明 |

### AppTypography 使用示例

```dart
// 正确使用
Text(
  '标题文本',
  style: AppTypography.title1.copyWith(
    color: AppColors.textPrimary,
  ),
)

// 错误使用
Text(
  '标题文本',
  style: TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
  ),
)
```

---

## 📏 间距系统

### 8pt 网格系统

所有间距遵循 8pt 基准网格：

```dart
class AppSpacing {
  static const double xs = 4.0;    // 超小间距
  static const double sm = 8.0;    // 小间距
  static const double md = 16.0;   // 标准间距
  static const double lg = 24.0;   // 大间距
  static const double xl = 32.0;   // 特大间距
  static const double xxl = 48.0;  // 超大间距
}
```

### 使用场景

| 间距 | 使用场景 |
|------|---------|
| xs (4pt) | 标签内部间距、图标与文字间距 |
| sm (8pt) | 列表项内间距、元素间小间距 |
| md (16pt) | 卡片内边距、列表项间距 |
| lg (24pt) | 区块间间距、卡片间距 |
| xl (32pt) | 页面边距、Section 间距 |
| xxl (48pt) | 大区块分隔、页面顶部/底部间距 |

---

## 🔲 圆角系统

### 分档圆角

```dart
class AppRadius {
  static const double sm = 6.0;    // 小圆角 - 按钮、标签
  static const double md = 10.0;   // 中等圆角 - 输入框
  static const double lg = 12.0;   // 大圆角 - 卡片
  static const double xl = 16.0;   // 超大圆角 - 大卡片
  static const double xxl = 20.0;  // 特大圆角 - 模态框
  static const double full = 9999; // 圆形 - 头像、胶囊按钮
}
```

### 使用规范

| 圆角 | 组件类型 |
|------|---------|
| sm | 按钮、标签、Chip |
| md | 输入框、选择器 |
| lg | 小卡片、图片卡片 |
| xl | Banner、大图片卡片 |
| xxl | 模态弹窗、底部弹窗 |
| full | 圆形头像、胶囊按钮 |

---

## 🌑 深色模式

### 深色模式适配

所有颜色必须支持深色模式：

```dart
// 颜色定义示例
class AppColors {
  static Color background(BuildContext context) {
    return CupertinoTheme.of(context).brightness == Brightness.dark
        ? AppColors.darkBackground
        : AppColors.lightBackground;
  }
}
```

### 深色模式色彩映射

| 浅色模式 | 深色模式 | 说明 |
|---------|---------|------|
| `#FFFFFF` | `#000000` | 背景色反转 |
| `#F2F2F7` | `#1C1C1E` | 页面背景 |
| `#FFFFFF` | `#2C2C2E` | 卡片背景 |
| `#000000` | `#FFFFFF` | 文字颜色 |

---

## 📦 组件库

### 通用组件列表

| 组件名 | 用途 | 状态 |
|--------|------|------|
| `IOSCard` | 通用卡片容器 | ✅ 已实现 |
| `IOSButton` | 按钮组件 | ✅ 已实现 |
| `IOSTag` | 标签/Chip 组件 | ✅ 已实现 |
| `IOSListTile` | 列表项组件 | ✅ 已实现 |
| `IOSEmptyState` | 空状态提示 | 🔄 待完善 |
| `IOSLoadingIndicator` | 加载指示器 | ✅ 已实现 |
| `IOSIconButton` | 图标按钮 | ✅ 已实现 |
| `IOSAvatar` | 头像组件 | ✅ 已实现 |
| `IOSStatCard` | 统计卡片 | ✅ 已实现 |

### IOSCard 使用示例

```dart
IOSCard(
  padding: AppSpacing.md,
  radius: AppRadius.lg,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 卡片内容
    ],
  ),
)
```

### IOSTag 使用示例

```dart
IOSTag(
  label: '热门',
  color: AppColors.primary,
  size: TagSize.small,
)
```

---

## 🖼 图片规范

### 图片比例

| 类型 | 比例 | 使用场景 |
|------|------|---------|
| 文章封面 | 16:10 | 瀑布流卡片 |
| Banner | 16:9 | 轮播图 |
| 头像 | 1:1 | 用户头像 |
| 缩略图 | 4:3 | 列表小图 |

### 图片加载策略

```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => ImagePlaceholder(),
  errorWidget: (context, url, error) => ImageErrorWidget(),
  fit: BoxFit.cover,
  fadeInDuration: Duration(milliseconds: 200),
  fadeOutDuration: Duration(milliseconds: 200),
)
```

---

## 🌈 阴影规范

### 卡片阴影

```dart
// 浅色阴影（默认）
BoxShadow(
  color: Colors.black.withOpacity(0.08),
  blurRadius: 12,
  offset: Offset(0, 4),
)

// 深色阴影（深色模式）
BoxShadow(
  color: Colors.black.withOpacity(0.3),
  blurRadius: 12,
  offset: Offset(0, 4),
)
```

### 使用场景

| 阴影 | 使用场景 |
|------|---------|
| 轻阴影 | 页面卡片、悬浮按钮 |
| 中阴影 | 弹窗、底部导航栏 |
| 重阴影 | Modal、浮层 |

---

## 📱 适配规范

### 安全区域

```dart
// 使用 SafeArea 包裹
SafeArea(
  child: content,
)

// 底部导航适配
MediaQuery.of(context).padding.bottom
```

### 刘海屏适配

- 顶部内容使用 SafeArea
- 横屏时考虑两侧安全区
- 避免内容被刘海遮挡

### 设备尺寸适配

| 设备 | 宽度 | 适配策略 |
|------|------|---------|
| iPhone SE | 320pt | 单列布局 |
| iPhone 标准 | 375pt | 标准布局 |
| iPhone Plus/Max | 414pt | 宽松布局 |
| iPad | 可变 | 自适应网格 |

---

## 🎯 视觉验收标准

### 风格统一
- [ ] 所有页面使用统一的色彩系统
- [ ] 所有文字使用 AppTypography
- [ ] 所有间距使用 AppSpacing
- [ ] 所有圆角使用 AppRadius

### 细节到位
- [ ] 深色/浅色模式完美适配
- [ ] 加载状态有骨架屏
- [ ] 错误状态有友好提示
- [ ] 空状态有引导文案

### 像素完美
- [ ] 间距符合 8pt 网格
- [ ] 圆角符合分档规范
- [ ] 文字层级清晰
- [ ] 图标大小统一
