# 功能模块详细设计

## 📱 首页模块 (Home)

### 模块概述
首页是用户进入应用的第一个页面，承担内容发现和用户留存的重要职责。

### 功能清单

#### 1.1 Banner 轮播区

**功能描述：**
- 展示热门活动、精选专题、新热词推荐
- 自动轮播（3秒/张）
- 支持手动滑动切换
- 底部指示器显示当前位置

**技术实现：**
```dart
// Banner 数据模型
class BannerItem {
  final String id;
  final String title;
  final String image;
  final String? link;
}

// Banner Provider
final bannersProvider = FutureProvider<List<BannerItem>>
```

**交互规范：**
- 自动轮播间隔：3000ms
- 切换动画时长：300ms
- 切换曲线：`Curves.easeInOut`
- 点击响应：`HapticFeedback.lightImpact()`

#### 1.2 瀑布流文章列表

**功能描述：**
- 展示文章卡片列表
- 两列瀑布流布局
- 高度自适应内容
- 支持下拉刷新、上拉加载

**技术实现：**
```dart
// 使用 flutter_staggered_grid_view
MasonryGridView.count(
  crossAxisCount: 2,
  mainAxisSpacing: 12,
  crossAxisSpacing: 12,
  itemCount: articles.length,
  itemBuilder: (context, index) => ArticleCard(
    article: articles[index],
  ),
)
```

**交互规范：**
- 下拉刷新：`CupertinoSliverRefreshControl`
- 上拉加载：滚动到底部前 200pt 触发
- 点击反馈：卡片缩放 0.98 + 透明度 0.8
- 点击动画：`HapticFeedback.selectionClick()`

#### 1.3 文章卡片

**功能描述：**
- 封面图片（16:10比例）
- 标题（最多2行，超出省略）
- 摘要（最多1行）
- 热词标签
- 互动数据（点赞、评论数）

**组件规范：**
```dart
IOSCard(
  padding: EdgeInsets.all(AppSpacing.sm),
  radius: AppRadius.lg,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 封面图
      AspectRatio(
        aspectRatio: 16 / 10,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.md),
          child: CachedNetworkImage(...),
        ),
      ),
      SizedBox(height: AppSpacing.sm),
      // 标题
      Text(article.title, style: AppTypography.headline),
      SizedBox(height: AppSpacing.xs),
      // 摘要
      Text(article.summary, style: AppTypography.caption1),
      SizedBox(height: AppSpacing.sm),
      // 标签
      Row(
        children: article.tags.map((tag) => IOSTag(label: tag)).toList(),
      ),
      SizedBox(height: AppSpacing.sm),
      // 互动数据
      Row(
        children: [
          Icon(CupertinoIcons.heart, size: 14),
          Text('${article.likeCount}'),
          SizedBox(width: AppSpacing.md),
          Icon(CupertinoIcons.chat_bubble, size: 14),
          Text('${article.commentCount}'),
        ],
      ),
    ],
  ),
)
```

---

## 🔍 搜索模块 (Search)

### 模块概述
搜索模块帮助用户快速找到感兴趣的热词和文章。

### 功能清单

#### 2.1 搜索栏

**功能描述：**
- 固定在页面顶部
- 支持实时输入
- 清除输入按钮
- 语音搜索入口（可选）

**交互规范：**
- 输入联想延迟：300ms
- 清除按钮：输入不为空时显示
- 语音按钮：使用 `CupertinoIcons.mic`

#### 2.2 推荐词条

**功能描述：**
- 展示热门热词标签
- 流式布局展示
- 点击直接搜索

**布局规范：**
```dart
Wrap(
  spacing: AppSpacing.sm,
  runSpacing: AppSpacing.sm,
  children: hotWords.map((word) => IOSTag(
    label: word.word,
    onTap: () => search(word.word),
  )).toList(),
)
```

#### 2.3 搜索历史

**功能描述：**
- 记录用户搜索词
- 最多保存 20 条
- 支持一键清除
- 点击可直接搜索

**技术实现：**
```dart
// 搜索历史 Provider
final searchHistoryProvider = StateNotifierProvider<SearchHistoryNotifier, List<String>>

// 本地存储
class SearchHistoryNotifier extends StateNotifier<List<String>> {
  Future<void> addHistory(String query) async {
    // 添加到列表头部
    // 最多保留 20 条
    // 持久化到本地
  }
}
```

#### 2.4 搜索结果

**功能描述：**
- 展示相关文章列表
- 分类展示（热词/文章）
- 排序选项（热度/时间）

**展示规范：**
- 搜索结果列表使用 `ListView`
- 每个结果项显示：标题、摘要、标签、时间
- 空结果显示友好提示

---

## 📖 文章详情模块 (Article Detail)

### 模块概述
文章详情页展示文章完整内容，提供丰富的互动功能。

### 功能清单

#### 3.1 页面结构

```dart
CustomScrollView(
  slivers: [
    // 封面 Hero 图
    SliverToBoxAdapter(
      child: Hero(
        tag: 'article-cover-$id',
        child: Image(...),
      ),
    ),
    // 标题区
    SliverToBoxAdapter(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(article.title, style: AppTypography.title1),
          // 作者、时间、标签
          // ...
        ],
      ),
    ),
    // 内容区
    SliverToBoxAdapter(
      child: Text(article.content, style: AppTypography.body),
    ),
    // 相关热词
    SliverToBoxAdapter(
      child: RelatedHotWords(hotWords: article.relatedWords),
    ),
    // 互动区
    SliverToBoxAdapter(
      child: InteractionBar(article: article),
    ),
    // 评论区
    SliverToBoxAdapter(
      child: CommentSection(comments: comments),
    ),
    // 底部留白（适配安全区域）
    SliverToBoxAdapter(
      child: SizedBox(height: MediaQuery.of(context).padding.bottom + 60),
    ),
  ],
)
```

#### 3.2 点赞功能

**功能描述：**
- 点击切换点赞状态
- 带动画效果
- 数量实时更新

**动画实现：**
```dart
GestureDetector(
  onTap: () {
    HapticFeedback.mediumImpact();
    toggleLike();
  },
  child: TweenAnimationBuilder<double>(
    tween: Tween(begin: 1.0, end: isLiked ? 1.2 : 1.0),
    duration: Duration(milliseconds: 150),
    builder: (context, scale, child) {
      return Transform.scale(
        scale: scale,
        child: Icon(
          isLiked ? CupertinoIcons.heart_fill : CupertinoIcons.heart,
          color: isLiked ? Colors.red : Colors.grey,
        ),
      );
    },
  ),
)
```

#### 3.3 收藏功能

**功能描述：**
- 点击切换收藏状态
- 动画反馈
- 收藏列表同步更新

#### 3.4 分享功能

**功能描述：**
- 点击显示 ActionSheet
- 支持分享到各平台
- 生成分享海报（可选）

**技术实现：**
```dart
showCupertinoModalPopup(
  context: context,
  builder: (context) => CupertinoActionSheet(
    actions: [
      CupertinoActionSheetAction(
        onPressed: () => shareToWechat(),
        child: Text('微信'),
      ),
      CupertinoActionSheetAction(
        onPressed: () => shareToWeibo(),
        child: Text('微博'),
      ),
      CupertinoActionSheetAction(
        onPressed: () => copyLink(),
        child: Text('复制链接'),
      ),
    ],
  ),
)
```

#### 3.5 评论功能

**功能描述：**
- 评论列表展示
- 发表新评论
- 回复功能
- 评论点赞

**键盘适配：**
```dart
Padding(
  padding: EdgeInsets.only(
    bottom: MediaQuery.of(context).viewInsets.bottom,
  ),
  child: CommentInput(),
)
```

---

## 👤 个人中心模块 (Profile)

### 模块概述
个人中心管理用户信息和提供各类功能入口。

### 功能清单

#### 4.1 用户信息区

**布局规范：**
```dart
Row(
  children: [
    IOSAvatar(
      imageUrl: user.avatar,
      size: 80,
      onTap: () => changeAvatar(),
    ),
    SizedBox(width: AppSpacing.md),
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(user.username, style: AppTypography.title2),
        Text('ID: ${user.id}', style: AppTypography.caption1),
      ],
    ),
  ],
)
```

#### 4.2 统计数据

**功能描述：**
- 收藏数
- 浏览数
- 评论数
- 点赞数

**布局规范：**
```dart
IOSStatCard(
  stats: [
    StatItem(label: '收藏', value: user.bookmarkCount),
    StatItem(label: '浏览', value: user.viewCount),
    StatItem(label: '评论', value: user.commentCount),
    StatItem(label: '点赞', value: user.likeCount),
  ],
)
```

#### 4.3 功能菜单

**菜单列表：**
- 我的收藏
- 浏览历史
- 我的评论
- 我的点赞
- 设置
- 意见反馈
- 关于我们

**布局规范：**
```dart
IOSListTile(
  leading: Icon(CupertinoIcons.bookmark),
  title: '我的收藏',
  trailing: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text('${user.bookmarkCount}'),
      SizedBox(width: AppSpacing.sm),
      Icon(CupertinoIcons.chevron_right),
    ],
  ),
  onTap: () => navigateTo('/collection'),
)
```

#### 4.4 设置页面

**设置项：**
- 深色模式切换
- 通知设置
- 清理缓存
- 检查更新
- 退出登录

---

## 🚀 通用功能

### 5.1 启动页 (Splash)

**功能描述：**
- 应用 Logo 展示
- 初始化数据加载
- 路由跳转

**交互规范：**
- 展示时长：最少 1.5s
- Logo 淡入动画
- 数据加载完成后跳转

### 5.2 主标签页 (Main Tab)

**布局规范：**
```dart
CupertinoTabScaffold(
  tabBar: CupertinoTabBar(
    currentIndex: currentTab,
    onTap: (index) => changeTab(index),
    items: [
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.home),
        activeIcon: Icon(CupertinoIcons.home_fill),
        label: '首页',
      ),
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.search),
        label: '搜索',
      ),
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.person),
        activeIcon: Icon(CupertinoIcons.person_fill),
        label: '我的',
      ),
    ],
  ),
)
```

---

## 🔧 模块间通信

### 路由参数传递

```dart
// 跳转时传递参数
context.push('/article/${article.id}');

// 详情页接收参数
GoRoute(
  path: '/article/:id',
  builder: (context, state) => ArticleDetailScreen(
    id: state.pathParameters['id']!,
  ),
)
```

### 状态共享

```dart
// 全局 Provider
final likedArticlesProvider = StateNotifierProvider<LikedArticlesNotifier, Set<String>>

// 跨模块使用
final likedArticles = ref.watch(likedArticlesProvider);
```

### 事件通知

```dart
// 使用事件总线
EventBus.instance.emit('article_updated', articleId);

// 监听事件
EventBus.instance.on('article_updated', (articleId) {
  // 刷新列表
});
```
