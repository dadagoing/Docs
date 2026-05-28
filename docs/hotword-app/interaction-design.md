# 交互设计规范

## 🎯 交互原则

### 1. 即时反馈
- 所有可点击元素都有视觉反馈
- 加载状态明确提示
- 操作结果即时可见

### 2. 流畅动画
- 页面转场使用 iOS 标准动画
- 元素入场采用错开动画
- 点赞等互动有情感化反馈

### 3. 自然手势
- 支持 iOS 标准手势
- 右滑返回上一级
- 下拉刷新列表

### 4. 无障碍支持
- 支持动态字体缩放
- VoiceOver 友好
- 颜色对比度符合 WCAG 标准

---

## 📱 页面过渡动画

### 标准页面转场

```dart
// 右侧滑入（iOS 标准）
CupertinoPageRoute(
  builder: (context) => targetPage,
)

// 自定义转场动画
PageTransition(
  child: targetPage,
  duration: Duration(milliseconds: 300),
  curve: Curves.easeInOut,
)
```

### 详情页 Hero 动画

```dart
// 封面图 Hero 动画
Hero(
  tag: 'article-cover-$id',
  child: Image.network(coverUrl),
)

// 详情页 Hero 接收
Hero(
  tag: 'article-cover-$id',
  child: Image.network(coverUrl, fit: BoxFit.cover),
)
```

### 底部弹窗动画

```dart
// 底部弹出
showCupertinoModalPopup(
  context: context,
  builder: (context) => actionSheet,
)

// 淡入弹出
showCupertinoDialog(
  context: context,
  builder: (context) => dialog,
)
```

---

## 👆 触摸反馈

### 点击反馈

```dart
// 按钮点击效果
GestureDetector(
  onTap: () => handleTap(),
  child: AnimatedContainer(
    duration: Duration(milliseconds: 100),
    transform: Matrix4.identity()..scale(isPressed ? 0.98 : 1.0),
    child: buttonContent,
  ),
)

// 或使用 AnimatedOpacity
AnimatedOpacity(
  duration: Duration(milliseconds: 100),
  opacity: isPressed ? 0.7 : 1.0,
  child: buttonContent,
)
```

### 触觉反馈

```dart
// 轻触反馈（点赞等小操作）
HapticFeedback.lightImpact();

// 中等反馈（选择操作）
HapticFeedback.mediumImpact();

// 重反馈（重要操作）
HapticFeedback.heavyImpact();

// 选择反馈
HapticFeedback.selectionClick();
```

### 列表项反馈

```dart
// 列表项点击效果
ListTile(
  onTap: () => handleTap(),
  // 使用 CupertinoColors 系统色
  tileColor: CupertinoColors.systemBackground,
)
```

---

## 💫 动画效果规范

### 动画时长

| 动画类型 | 时长 | 适用场景 |
|---------|------|---------|
| 微交互 | 100-150ms | 按钮点击、状态切换 |
| 页面元素 | 200-300ms | 列表项入场、卡片展开 |
| 页面转场 | 300-400ms | 页面切换、弹窗出现 |
| Banner 轮播 | 3000ms | 自动轮播间隔 |

### 动画曲线

```dart
// 标准曲线
Curves.easeInOut      // 大部分场景

// 特殊曲线
Curves.easeIn         // 元素出现
Curves.easeOut        // 元素消失
Curves.easeInOutCubic // 平滑效果
Curves.bounceOut      // 弹性效果（点赞）
```

### 点赞动画

```dart
// 点赞放大缩小动画
AnimatedScale(
  scale: isLiked ? 1.2 : 1.0,
  duration: Duration(milliseconds: 150),
  onEnd: () {
    // 恢复原大小
  },
  child: AnimatedScale(
    scale: 1.0,
    duration: Duration(milliseconds: 100),
  ),
)

// 心形颜色变化
AnimatedContainer(
  duration: Duration(milliseconds: 200),
  color: isLiked ? Colors.red : Colors.grey,
)
```

### 骨架屏动画

```dart
// 骨架屏闪烁动画
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Container(
    width: 200,
    height: 20,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8),
    ),
  ),
)
```

### 列表项入场动画

```dart
// 错开动画
SlideTransition(
  position: Tween<Offset>(
    begin: Offset(0, 0.3),
    end: Offset.zero,
  ).animate(CurvedAnimation(
    parent: animation,
    curve: Interval(index * 0.1, 1.0, curve: Curves.easeOut),
  )),
  child: FadeTransition(
    opacity: animation,
    child: listItem,
  ),
)
```

---

## 🔄 列表交互

### 下拉刷新

```dart
CustomScrollView(
  slivers: [
    CupertinoSliverRefreshControl(
      onRefresh: () async {
        await loadData();
      },
    ),
    // 列表内容
  ],
)
```

### 上拉加载

```dart
// 使用 NotificationListener 监听滚动
NotificationListener<ScrollNotification>(
  onNotification: (notification) {
    if (notification is ScrollEndNotification) {
      final metrics = notification.metrics;
      if (metrics.pixels >= metrics.maxScrollExtent - 200) {
        loadMoreData();
      }
    }
    return true;
  },
  child: listView,
)

// 或使用 InfiniteScrollPhysics
physics: AlwaysScrollableScrollPhysics(
  parent: BouncingScrollPhysics(),
)
```

### 加载指示器

```dart
// 底部加载指示器
SliverToBoxAdapter(
  child: Padding(
    padding: EdgeInsets.all(AppSpacing.lg),
    child: Center(
      child: CupertinoActivityIndicator(),
    ),
  ),
)

// 加载更多指示器
if (isLoading) {
  return CupertinoActivityIndicator();
} else if (hasMore) {
  return Text('上拉加载更多');
} else {
  return Text('没有更多了');
}
```

---

## ⌨️ 键盘适配

### 键盘弹出处理

```dart
// 评论输入框适配
class CommentInput extends StatefulWidget {
  @override
  _CommentInputState createState() => _CommentInputState();
}

class _CommentInputState extends State<CommentInput> {
  bool _isKeyboardVisible = false;

  @override
  void initState() {
    super.initState();
    KeyboardVisibilityController().onChange.listen((visible) {
      setState(() => _isKeyboardVisible = visible);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 200),
      height: _isKeyboardVisible ? 300 : 200, // 调整高度
      child: TextField(),
    );
  }
}
```

### 安全区域处理

```dart
// 底部输入框
Padding(
  padding: EdgeInsets.only(
    bottom: MediaQuery.of(context).viewInsets.bottom,
  ),
  child: inputField,
)
```

---

## 🎪 特殊交互

### 双击喜欢

```dart
GestureDetector(
  onDoubleTap: () {
    // 触发点赞动画
    HapticFeedback.mediumImpact();
    toggleLike();
  },
  child: content,
)
```

### 长按菜单

```dart
GestureDetector(
  onLongPress: () {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => CupertinoActionSheet(
        actions: [
          CupertinoActionSheetAction(
            onPressed: () => handleCopy(),
            child: Text('复制'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => handleShare(),
            child: Text('分享'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.pop(context),
          child: Text('取消'),
        ),
      ),
    );
  },
  child: content,
)
```

### 右滑返回

```dart
// CupertinoPageRoute 默认支持右滑返回
// 自定义返回行为
WillPopScope(
  onWillPop: () async {
    // 返回前处理
    return true;
  },
  child: pageContent,
)

// 使用 PopScope (Flutter 3.16+)
PopScope(
  canPop: false,
  onPopInvokedWithResult: (didPop, result) {
    if (!didPop) {
      // 处理返回
    }
  },
  child: pageContent,
)
```

---

## 🔔 提示反馈

### Toast 提示

```dart
// 成功提示
showCupertinoDialog(
  context: context,
  barrierDismissible: true,
  builder: (context) => CupertinoAlertDialog(
    title: Text('成功'),
    content: Text('操作已完成'),
    actions: [
      CupertinoDialogAction(
        child: Text('确定'),
        onPressed: () => Navigator.pop(context),
      ),
    ],
  ),
)
```

### 操作确认

```dart
showCupertinoDialog(
  context: context,
  builder: (context) => CupertinoAlertDialog(
    title: Text('确认操作'),
    content: Text('确定要执行此操作吗？'),
    actions: [
      CupertinoDialogAction(
        isDestructiveAction: true,
        onPressed: () => Navigator.pop(context),
        child: Text('取消'),
      ),
      CupertinoDialogAction(
        isDefaultAction: true,
        onPressed: () {
          Navigator.pop(context);
          executeOperation();
        },
        child: Text('确定'),
      ),
    ],
  ),
)
```

### ActionSheet

```dart
showCupertinoModalPopup(
  context: context,
  builder: (context) => CupertinoActionSheet(
    title: Text('选择操作'),
    message: Text('请选择要执行的操作'),
    actions: [
      CupertinoActionSheetAction(
        onPressed: () {
          Navigator.pop(context);
          handleAction1();
        },
        child: Text('操作一'),
      ),
      CupertinoActionSheetAction(
        onPressed: () {
          Navigator.pop(context);
          handleAction2();
        },
        child: Text('操作二'),
      ),
    ],
    cancelButton: CupertinoActionSheetAction(
      onPressed: () => Navigator.pop(context),
      child: Text('取消'),
    ),
  ),
)
```

---

## 📊 交互验收标准

### 反馈及时性
- [ ] 点击反馈延迟 < 100ms
- [ ] 加载状态 200ms 内出现
- [ ] 动画流畅无卡顿

### 动画质量
- [ ] 所有动画帧率 > 50fps
- [ ] 动画曲线自然流畅
- [ ] 交互动画有弹性效果

### 手势支持
- [ ] 支持右滑返回
- [ ] 支持下拉刷新
- [ ] 支持双指缩放（图片）
- [ ] 列表滚动流畅

### 无障碍
- [ ] VoiceOver 可朗读所有元素
- [ ] 支持动态字体缩放
- [ ] 颜色对比度符合标准
- [ ] 操作有明确的音频/触觉反馈
