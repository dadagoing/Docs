# 项目结构详解

## 📂 整体目录结构

```
ai-app/
├── lib/                          # Dart 代码目录
│   ├── main.dart                 # 应用入口
│   ├── app.dart                  # 应用根组件
│   │
│   ├── core/                     # 核心模块（全局共享）
│   │   ├── config/              # 配置文件
│   │   ├── constants/           # 常量定义
│   │   ├── components/          # 通用组件库
│   │   ├── theme/               # 主题配置
│   │   ├── router/              # 路由配置
│   │   ├── providers/           # 全局 Provider
│   │   ├── utils/               # 工具函数
│   │   └── widgets/             # 通用 Widget
│   │
│   └── features/                # 功能模块（按特性组织）
│       ├── splash/
│       ├── home/
│       ├── search/
│       ├── article/
│       ├── profile/
│       └── main_tab/
│
├── test/                         # 测试目录
├── web/                          # Web 平台支持
├── windows/                      # Windows 平台支持
├── macos/                        # macOS 平台支持
├── ios/                          # iOS 平台支持
├── android/                      # Android 平台支持
│
├── pubspec.yaml                  # 依赖管理
├── analysis_options.yaml         # 代码分析配置
└── README.md                     # 项目说明
```

---

## 🎯 目录职责划分

### lib/core/ - 核心模块

#### config/ - 配置文件

```
config/
└── environment.dart      # 环境配置（开发/生产）
```

**职责：**
- 环境变量管理
- API 地址配置
- 功能开关配置

**示例内容：**
```dart
class Environment {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://xxx.supabase.co',
  );
  
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'xxx',
  );
  
  static const bool useMockData = bool.fromEnvironment(
    'USE_MOCK_DATA',
    defaultValue: true,
  );
}
```

#### constants/ - 常量定义

```
constants/
└── app_constants.dart    # 应用常量
```

**职责：**
- 存储应用级常量
- 动画时长配置
- 缓存策略配置
- 业务常量定义

**示例内容：**
```dart
class AppConstants {
  // 动画时长
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration quickAnimationDuration = Duration(milliseconds: 150);
  
  // 缓存配置
  static const Duration cacheDuration = Duration(hours: 24);
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  
  // 分页配置
  static const int pageSize = 20;
  
  // 搜索历史
  static const int maxSearchHistory = 20;
}
```

#### components/ - 通用组件库

```
components/
└── ios_components.dart    # iOS 风格组件库
```

**职责：**
- 封装可复用的 UI 组件
- 统一组件样式和行为
- 降低页面开发复杂度

**组件列表：**
- IOSCard
- IOSButton
- IOSTag
- IOSListTile
- IOSEmptyState
- IOSLoadingIndicator
- IOSIconButton
- IOSAvatar
- IOSStatCard

#### theme/ - 主题配置

```
theme/
├── app_theme.dart    # 主题定义
└── app_icons.dart    # 图标系统
```

**职责：**
- 定义应用色彩系统
- 定义字体系统
- 定义间距和圆角
- 图标统一管理
- 深色/浅色模式适配

**AppTheme 示例：**
```dart
class AppTheme {
  static CupertinoThemeData get lightTheme => CupertinoThemeData(
    brightness: Brightness.light,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    textTheme: CupertinoTextThemeData(
      primaryColor: AppColors.textPrimary,
    ),
  );
  
  static CupertinoThemeData get darkTheme => CupertinoThemeData(
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.darkBackground,
    textTheme: CupertinoTextThemeData(
      primaryColor: AppColors.darkTextPrimary,
    ),
  );
}
```

#### router/ - 路由配置

```
router/
└── app_router.dart    # GoRouter 配置
```

**职责：**
- 定义所有路由
- 路由守卫
- 路由参数传递
- 页面过渡动画

**示例：**
```dart
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => SplashScreen()),
    ShellRoute(
      builder: (_, __, child) => MainTabScreen(child: child),
      routes: [...],
    ),
  ],
);
```

#### providers/ - 全局 Provider

```
providers/
└── supabase_provider.dart    # Supabase 客户端
```

**职责：**
- 提供全局单例 Provider
- 第三方服务初始化
- 跨模块状态共享

#### utils/ - 工具函数

```
utils/
├── gesture_util.dart    # 手势工具
├── haptic_util.dart     # 触觉反馈工具
├── image_util.dart      # 图片处理工具
└── utils.dart           # 通用工具
```

**职责：**
- 封装常用工具函数
- 提供全局辅助方法
- 统一工具调用方式

#### widgets/ - 通用 Widget

```
widgets/
└── common_widgets.dart    # 通用 Widget
```

**职责：**
- 封装高度可复用的 Widget
- 页面通用结构组件
- 全局弹窗、提示等

---

### lib/features/ - 功能模块

每个功能模块采用三层层级结构：

```
features/
└── [module_name]/
    ├── data/                    # 数据层
    │   ├── datasources/        # 数据源
    │   │   ├── local/          # 本地数据源
    │   │   └── remote/         # 远程数据源
    │   └── repositories/       # Repository 实现
    │
    ├── domain/                  # 领域层
    │   ├── entities/           # 业务实体
    │   ├── repositories/       # Repository 接口
    │   └── use_cases/         # 用例（可选）
    │
    └── presentation/           # 表现层
        ├── providers/         # 页面级 Provider
        ├── widgets/           # 页面私有组件
        └── screens/           # 页面组件
```

#### 1. splash/ - 启动页模块

```
splash/
└── presentation/
    └── splash_screen.dart    # 启动页
```

**职责：**
- 应用初始化
- 路由跳转
- 启动动画

#### 2. home/ - 首页模块

```
home/
├── data/
│   └── repositories/
│       ├── mock_home_repository.dart
│       └── supabase_home_repository.dart
├── domain/
│   ├── entities/
│   │   └── article.dart
│   ├── repositories/
│   │   └── home_repository.dart
│   └── use_cases/
│       └── get_articles.dart
└── presentation/
    ├── providers/
    │   └── home_providers.dart
    ├── widgets/
    │   ├── banner_widget.dart
    │   ├── article_card.dart
    │   └── article_list.dart
    └── home_screen.dart
```

**职责：**
- 首页内容展示
- Banner 轮播
- 文章瀑布流
- 刷新和加载

#### 3. search/ - 搜索模块

```
search/
├── domain/
│   └── entities/
│       └── hot_word.dart
└── presentation/
    ├── providers/
    │   └── search_providers.dart
    ├── widgets/
    │   ├── search_bar.dart
    │   ├── hot_words.dart
    │   └── search_history.dart
    └── search_screen.dart
```

**职责：**
- 搜索功能
- 推荐热词
- 搜索历史
- 搜索结果

#### 4. article/ - 文章详情模块

```
article/
└── presentation/
    ├── providers/
    │   └── article_providers.dart
    ├── widgets/
    │   ├── article_header.dart
    │   ├── article_content.dart
    │   ├── interaction_bar.dart
    │   └── comment_section.dart
    └── article_detail_screen.dart
```

**职责：**
- 文章详情展示
- 点赞/收藏
- 评论功能
- 相关推荐

#### 5. profile/ - 个人中心模块

```
profile/
└── presentation/
    ├── providers/
    │   └── profile_providers.dart
    ├── widgets/
    │   ├── user_info.dart
    │   ├── stat_card.dart
    │   └── menu_list.dart
    └── profile_screen.dart
```

**职责：**
- 用户信息展示
- 统计数据
- 功能菜单
- 设置页面

#### 6. main_tab/ - 主标签页模块

```
main_tab/
└── presentation/
    └── main_tab_screen.dart    # 底部标签栏
```

**职责：**
- 底部导航栏
- 页面切换
- Tab 状态管理

---

## 📐 分层架构详解

### Presentation Layer (表现层)

**目录：** `features/*/presentation/`

**职责：**
- UI 组件实现
- 用户交互处理
- 状态消费
- 页面布局

**使用原则：**
```dart
// ✅ 正确：UI 与业务分离
class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final articles = ref.watch(articlesProvider);
    
    return ListView.builder(
      itemCount: articles.length,
      itemBuilder: (context, index) {
        return ArticleCard(article: articles[index]);
      },
    );
  }
}

// ❌ 错误：在 Widget 中处理业务逻辑
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 不要在这里调用 API
    final data = await fetchData();
  }
}
```

### Domain Layer (领域层)

**目录：** `features/*/domain/`

**职责：**
- 业务实体定义
- 业务规则封装
- Repository 接口定义
- 用例实现（可选）

**使用原则：**
```dart
// ✅ 正确：定义清晰的实体
class Article {
  final String id;
  final String title;
  final String content;
  
  bool get isValid => id.isNotEmpty && title.isNotEmpty;
}

// ✅ 正确：定义 Repository 接口
abstract class HomeRepository {
  Future<List<Article>> getArticles();
  Future<Article> getArticleById(String id);
}
```

### Data Layer (数据层)

**目录：** `features/*/data/`

**职责：**
- 数据获取（API/本地）
- 数据转换
- Repository 实现
- 数据缓存

**使用原则：**
```dart
// ✅ 正确：实现 Repository
class SupabaseHomeRepository implements HomeRepository {
  @override
  Future<List<Article>> getArticles() async {
    final response = await supabase.from('articles').select();
    return response.map((json) => Article.fromJson(json)).toList();
  }
}

// ✅ 正确：Mock 数据实现
class MockHomeRepository implements HomeRepository {
  @override
  Future<List<Article>> getArticles() async {
    await Future.delayed(Duration(seconds: 1));
    return MockData.articles;
  }
}
```

---

## 🎯 命名规范

### 文件命名

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| Dart 文件 | 小写下划线 | `home_screen.dart` |
| 目录 | 小写下划线 | `presentation/` |
| 测试文件 | `_test.dart` | `home_screen_test.dart` |
| Mock 文件 | `_mock.dart` | `home_repository_mock.dart` |

### 类命名

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| 普通类 | 大驼峰 | `class HomeScreen` |
| 抽象类 | 大驼峰 + `Base` | `abstract class BaseRepository` |
| 实现类 | 大驼峰 | `class SupabaseRepository` |
| Widget | 大驼峰 | `class ArticleCard` |
| Provider | 大驼峰 + `Provider` | `class ArticlesProvider` |
| State | 大驼峰 + `State` | `class HomeState` |
| Event | 大驼峰 + `Event` | `class HomeEvent` |

### 变量命名

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| 普通变量 | 小驼峰 | `final articleList = []` |
| 常量 | 大写下划线 | `const MAX_COUNT = 100` |
| 私有变量 | 小驼峰 + `_` | `int _counter = 0` |
| Provider | 小驼峰 + `Provider` | `final articlesProvider` |
| State变量 | 小驼峰 + `State` | `final homeState` |

---

## 🔄 数据流转示例

### 首页加载流程

```
1. 用户打开应用
   ↓
2. app.dart 初始化 GoRouter
   ↓
3. MainTabScreen 显示首页 Tab
   ↓
4. HomeScreen 调用 articlesProvider
   ↓
5. articlesProvider 从 Repository 获取数据
   ↓
6. Repository 判断使用 Mock 还是真实数据
   ↓
7. 返回 Article 列表
   ↓
8. HomeScreen 渲染文章列表
```

### 点赞流程

```
1. 用户点击点赞按钮
   ↓
2. HomeScreen 调用 toggleLike(articleId)
   ↓
3. likedArticlesProvider 更新状态
   ↓
4. UI 自动刷新（Consumer 监听）
   ↓
5. 触觉反馈 HapticFeedback
   ↓
6. 动画效果 TweenAnimationBuilder
   ↓
7. 持久化到本地（如果未登录）或云端（已登录）
```

---

## 📦 依赖注入

### Provider 初始化顺序

```dart
// main.dart
void main() {
  runApp(
    ProviderScope(
      overrides: [
        // 覆盖默认实现
        homeRepositoryProvider.overrideWith(
          () => Environment.useMockData
              ? MockHomeRepository()
              : SupabaseHomeRepository(),
        ),
      ],
      child: MyApp(),
    ),
  );
}
```

### Repository 注入

```dart
// home_providers.dart
final homeRepositoryProvider = Provider<HomeRepository>((ref) {
  throw UnimplementedError('需要在 ProviderScope 中覆盖');
});

final articlesProvider = FutureProvider<List<Article>>((ref) async {
  final repository = ref.watch(homeRepositoryProvider);
  return repository.getArticles();
});
```

---

## 🧪 测试目录结构

```
test/
├── unit/                    # 单元测试
│   ├── providers/
│   ├── repositories/
│   └── entities/
├── widget/                  # Widget 测试
│   ├── home_screen_test.dart
│   └── article_card_test.dart
├── integration/             # 集成测试
│   └── app_test.dart
└── fixtures/                # 测试数据
    ├── articles.json
    └── hot_words.json
```

---

## 🚀 发布目录

### iOS (ios/)

```
ios/
├── Runner/                   # iOS 应用代码
├── Runner.xcodeproj/       # Xcode 项目文件
├── Runner.xcworkspace/     # Xcode 工作空间
└── Podfile                 # CocoaPods 依赖
```

### Android (android/)

```
android/
├── app/                    # Android 应用代码
├── build.gradle            # Gradle 构建配置
└── settings.gradle         # Gradle 设置
```

---

## 📝 文档目录

项目文档位于 `ai-app/docs/`：

```
docs/
├── README.md                    # 文档首页
├── architecture.md               # 架构文档
├── product-planning.md          # 产品规划
├── design.md                    # 设计文档
└── api.md                       # API 文档
```

---

## 🎯 开发规范

### 1. 单一职责原则
每个文件、类、函数只做一件事。

### 2. 依赖方向
```
表现层 → 领域层 → 数据层
  ↓
核心层（提供基础设施）
```

### 3. 不循环依赖
避免模块之间的循环依赖。

### 4. 面向接口编程
使用抽象类型而非具体实现。

### 5. 统一代码风格
遵循 Dart 官方代码规范。

---

## 🔧 构建配置

### pubspec.yaml 依赖管理

```yaml
name: ai_app
description: 热梗百科 App

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

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
  shared_preferences: ^2.2.2
  json_annotation: ^4.8.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

---

> 📝 最后更新：2026-05-28
