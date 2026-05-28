# 技术架构设计

## 📋 技术栈概览

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| **框架** | Flutter 3.0+ | 跨平台移动开发框架 |
| **语言** | Dart 3.0+ | Flutter 官方语言 |
| **状态管理** | Riverpod 2.0+ | 类型安全、可测试的状态管理 |
| **路由管理** | GoRouter 13.0+ | 声明式路由解决方案 |
| **后端服务** | Supabase | 开源 Firebase 替代方案 |
| **UI 组件** | Cupertino | iOS 原生风格组件库 |
| **图片缓存** | cached_network_image | 高效图片加载与缓存 |
| **瀑布流布局** | flutter_staggered_grid_view | 高性能瀑布流实现 |
| **轮播组件** | carousel_slider | Banner 轮播支持 |

---

## 🏗 分层架构

项目采用清晰的分层架构模式：

```
┌─────────────────────────────────────┐
│     Presentation Layer (表现层)      │
│   - UI 组件、页面、动画交互           │
├─────────────────────────────────────┤
│       Domain Layer (领域层)          │
│   - 业务实体、领域逻辑、业务规则        │
├─────────────────────────────────────┤
│        Data Layer (数据层)           │
│   - 数据获取、数据转换、本地存储       │
└─────────────────────────────────────┘
```

### 各层职责

| 层级 | 职责 | 代码组织 |
|-----|------|---------|
| **Presentation** | UI 展示、用户交互、状态消费 | `features/*/presentation/` |
| **Domain** | 业务实体定义、接口抽象、业务逻辑 | `features/*/domain/` |
| **Data** | 数据源实现、Repository 实现、数据模型 | `features/*/data/` |

---

## 📂 项目结构

```
lib/
├── main.dart                 # 应用入口
├── app.dart                  # 应用根组件
│
├── core/                     # 核心模块（全局共享）
│   ├── config/              # 配置文件
│   │   └── environment.dart  # 环境配置
│   ├── constants/           # 常量定义
│   │   └── app_constants.dart
│   ├── components/          # 通用组件库
│   │   └── ios_components.dart
│   ├── theme/               # 主题配置
│   │   ├── app_theme.dart    # 主题定义
│   │   └── app_icons.dart    # 图标系统
│   ├── router/              # 路由配置
│   │   └── app_router.dart
│   ├── providers/           # 全局 Provider
│   │   └── supabase_provider.dart
│   ├── utils/               # 工具函数
│   │   ├── gesture_util.dart
│   │   ├── haptic_util.dart
│   │   ├── image_util.dart
│   │   └── utils.dart
│   └── widgets/             # 通用 Widget
│       └── common_widgets.dart
│
└── features/                # 功能模块（按特性组织）
    ├── splash/              # 启动页
    │   └── presentation/
    ├── home/                # 首页模块
    │   ├── data/
    │   │   └── repositories/
    │   ├── domain/
    │   │   ├── entities/
    │   │   ├── repositories/
    │   │   └── use_cases/
    │   └── presentation/
    │       ├── providers/
    │       └── home_screen.dart
    ├── search/              # 搜索模块
    │   └── presentation/
    ├── article/             # 文章详情模块
    │   └── presentation/
    ├── profile/             # 个人中心模块
    │   └── presentation/
    └── main_tab/            # 主标签页模块
        └── presentation/
```

---

## 🎛 状态管理 (Riverpod)

### Provider 类型使用规范

| Provider 类型 | 用途 | 示例 |
|-------------|------|------|
| `Provider` | 静态配置或计算 | `baseUrlProvider` |
| `StateProvider` | 简单状态管理 | `currentTabProvider` |
| `FutureProvider` | 异步数据获取 | `articlesProvider` |
| `StreamProvider` | 实时数据流 | `userStreamProvider` |
| `StateNotifierProvider` | 复杂状态逻辑 | `bookmarkNotifierProvider` |

### 核心 Provider 列表

```dart
// Tab 管理
final currentTabProvider = StateProvider<int>

// 首页数据
final bannersProvider = FutureProvider<List<BannerItem>>
final articlesProvider = FutureProvider<List<Article>>
final trendingWordsProvider = FutureProvider<List<HotWord>>

// 用户交互
final likedArticlesProvider = StateNotifierProvider<LikedArticlesNotifier, Set<String>>
final bookmarkedArticlesProvider = StateNotifierProvider<BookmarkNotifier, Set<String>>

// 搜索
final searchHistoryProvider = StateNotifierProvider<SearchHistoryNotifier, List<String>>
final searchResultsProvider = FutureProvider.family<List<Article>, String>
```

---

## 🛣 路由设计 (GoRouter)

### 路由表

| 路径 | 页面 | 说明 |
|-----|------|------|
| `/` | SplashScreen | 启动页 |
| `/home` | HomeScreen | 首页 |
| `/search` | SearchScreen | 搜索页 |
| `/profile` | ProfileScreen | 个人中心 |
| `/article/:id` | ArticleDetailScreen | 文章详情 |
| `/hotword/:id` | HotWordDetailScreen | 热词详情 |

### 路由配置示例

```dart
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    ShellRoute(
      builder: (context, state, child) => MainTabScreen(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => HomeScreen()),
        GoRoute(path: '/search', builder: (_, __) => SearchScreen()),
        GoRoute(path: '/profile', builder: (_, __) => ProfileScreen()),
      ],
    ),
    GoRoute(
      path: '/article/:id',
      pageBuilder: (context, state) => CustomTransitionPage(
        child: ArticleDetailScreen(id: state.pathParameters['id']!),
        transitionsBuilder: (_, animation, __, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(
              parent: animation,
              curve: Curves.easeInOut,
            )),
            child: child,
          );
        },
      ),
    ),
  ],
);
```

---

## 🎨 设计系统

### 色彩系统

```dart
// 主色调
primary: 0xFFFF3B30      // 品牌红
primaryLight: 0xFFFF8E8E // 浅红
primaryDark: 0xFFE55555  // 深红

// 辅助色
secondary: 0xFF4ECDC4    // 青色强调
accent: 0xFFFFE66D       // 黄色提示
success: 0xFF95E87A      // 绿色成功
info: 0xFF74B9FF         // 蓝色信息

// 中性色
textPrimary: 0xFF2D3436   // 主文本
textSecondary: 0xFF636E72 // 次要文本
textHint: 0xFFB2BEC3      // 提示文本
background: 0xFFFFFAFA    // 背景色
surface: 0xFFFFFFFF       // 卡片背景
divider: 0xFFE9ECEF       // 分割线
```

### 字体系统

| 用途 | 字号 | 字重 |
|------|------|------|
| largeTitle | 34pt | Bold (700) |
| title1 | 28pt | Bold (700) |
| title2 | 22pt | SemiBold (600) |
| title3 | 20pt | SemiBold (600) |
| headline | 17pt | SemiBold (600) |
| body | 17pt | Regular (400) |
| callout | 16pt | Regular (400) |
| subheadline | 15pt | Regular (400) |
| footnote | 13pt | Regular (400) |
| caption1 | 12pt | Regular (400) |
| caption2 | 11pt | Regular (400) |

### 间距系统 (8pt 网格)

```dart
xs: 4.0   // 超小间距
sm: 8.0   // 小间距
md: 16.0  // 标准间距
lg: 24.0  // 大间距
xl: 32.0  // 特大间距
xxl: 48.0 // 超大间距
```

### 圆角系统

```dart
sm: 6.0    // 小控件、标签
md: 10.0   // 中等组件
lg: 12.0   // 卡片
xl: 16.0   // 大卡片
xxl: 20.0  // 超大组件
full: 9999 // 胶囊/圆形头像
```

---

## 🔧 环境配置

### 开发环境切换

```bash
# 使用 Mock 数据
flutter run --dart-define=USE_MOCK_DATA=true

# 使用真实 Supabase 数据
flutter run --dart-define=USE_MOCK_DATA=false
```

### Supabase 配置

```dart
// environment.dart
class Environment {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://your-project.supabase.co',
  );
  
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'your-anon-key',
  );
}
```

---

## ⚡ 性能优化策略

### 1. 图片优化
- 使用 `cached_network_image` 实现图片缓存
- 支持占位图和错误图
- 按需加载，懒加载策略

### 2. 列表优化
- 使用 `Sliver` 系列组件
- 合理设置 `ItemExtent`
- 避免不必要的 rebuild

### 3. 状态管理优化
- 细粒度 Provider 划分
- 使用 `select` 监听特定字段
- 合理使用 `ref.watch` vs `ref.read`

### 4. 动画优化
- 使用 `TweenAnimationBuilder`
- 避免在动画中创建新对象
- 使用 `RepaintBoundary` 隔离重绘

---

## 🧪 测试策略

### 单元测试
- Provider 测试
- 业务逻辑测试
- 数据转换测试

### Widget 测试
- 组件渲染测试
- 交互行为测试
- 状态变化测试

### 集成测试
- 页面流程测试
- 端到端场景测试

---

## 📦 依赖管理

### pubspec.yaml 核心依赖

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  flutter_riverpod: ^2.4.9
  go_router: ^13.0.0
  supabase_flutter: ^2.3.0
  cached_network_image: ^3.3.1
  flutter_staggered_grid_view: ^0.7.0
  carousel_slider: ^4.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
```

---

## 🔄 代码规范

### 命名规范
- **文件命名**: 小写下划线 `home_screen.dart`
- **类命名**: 大驼峰 `class HomeScreen`
- **常量命名**: 大写下划线 `const API_BASE_URL`
- **Provider 命名**: `xxxProvider` 结尾

### 组件规范
- 使用 `const` 构造函数
- 提取重复 UI 为组件
- 组件职责单一

### 注释规范
- 公共 API 添加文档注释
- 复杂逻辑添加说明注释
- 避免无意义注释
