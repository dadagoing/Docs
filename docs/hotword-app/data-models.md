# 数据模型设计

## 📋 模型总览

本项目定义了以下核心数据模型：

| 模型 | 用途 | 存储位置 |
|------|------|---------|
| `Article` | 文章/热词内容 | 数据库 |
| `HotWord` | 热词词条 | 数据库 |
| `BannerItem` | 轮播内容 | 数据库 |
| `User` | 用户信息 | 数据库 |
| `Comment` | 评论数据 | 数据库 |
| `ArticleInteraction` | 用户互动记录 | 本地存储 |

---

## 🏗 数据模型定义

### 1. Article (文章)

```dart
class Article {
  final String id;
  final String title;
  final String summary;
  final String content;
  final String coverImage;
  final String author;
  final String authorAvatar;
  final DateTime publishTime;
  final int likeCount;
  final int commentCount;
  final int viewCount;
  final List<String> relatedWords;
  final List<String> tags;
  final bool isLiked;
  final bool isBookmarked;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 文章唯一标识符 |
| `title` | String | ✅ | 文章标题 |
| `summary` | String | ✅ | 文章摘要（用于列表展示） |
| `content` | String | ✅ | 文章正文内容 |
| `coverImage` | String | ✅ | 封面图片 URL |
| `author` | String | ✅ | 作者名称 |
| `authorAvatar` | String | ✅ | 作者头像 URL |
| `publishTime` | DateTime | ✅ | 发布时间 |
| `likeCount` | int | ✅ | 点赞数 |
| `commentCount` | int | ✅ | 评论数 |
| `viewCount` | int | ✅ | 浏览数 |
| `relatedWords` | List<String> | ❌ | 相关热词 ID 列表 |
| `tags` | List<String> | ❌ | 标签列表 |
| `isLiked` | bool | ❌ | 当前用户是否点赞（前端维护） |
| `isBookmarked` | bool | ❌ | 当前用户是否收藏（前端维护） |

**数据库表结构：**

```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  publish_time TIMESTAMP NOT NULL,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  related_words TEXT[], -- PostgreSQL array
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_publish_time ON articles(publish_time DESC);
CREATE INDEX idx_articles_like_count ON articles(like_count DESC);
```

---

### 2. HotWord (热词)

```dart
class HotWord {
  final String id;
  final String word;
  final String description;
  final String? coverImage;
  final int heat;
  final DateTime createdAt;
  final List<String> tags;
  final List<String> relatedArticles;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 热词唯一标识符 |
| `word` | String | ✅ | 热词内容 |
| `description` | String | ✅ | 热词释义 |
| `coverImage` | String? | ❌ | 封面图片 URL |
| `heat` | int | ✅ | 热度值 |
| `createdAt` | DateTime | ✅ | 创建时间 |
| `tags` | List<String> | ❌ | 标签列表 |
| `relatedArticles` | List<String> | ❌ | 相关文章 ID 列表 |

**数据库表结构：**

```sql
CREATE TABLE hot_words (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_image TEXT,
  heat INTEGER DEFAULT 0,
  tags TEXT[],
  related_articles TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hot_words_heat ON hot_words(heat DESC);
CREATE INDEX idx_hot_words_word ON hot_words(word);
```

---

### 3. BannerItem (轮播项)

```dart
class BannerItem {
  final String id;
  final String title;
  final String image;
  final String? link;
  final BannerType type;
  final DateTime? startTime;
  final DateTime? endTime;
}

enum BannerType {
  article,   // 文章详情
  hotword,   // 热词详情
  topic,     // 专题页
  external,  // 外部链接
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | Banner 唯一标识符 |
| `title` | String | ✅ | Banner 标题 |
| `image` | String | ✅ | Banner 图片 URL |
| `link` | String? | ❌ | 跳转链接 |
| `type` | BannerType | ✅ | Banner 类型 |
| `startTime` | DateTime? | ❌ | 展示开始时间 |
| `endTime` | DateTime? | ❌ | 展示结束时间 |

**数据库表结构：**

```sql
CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT,
  type TEXT NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_time ON banners(start_time, end_time);
```

---

### 4. User (用户)

```dart
class User {
  final String id;
  final String username;
  final String? avatar;
  final String? bio;
  final String? email;
  final String? phone;
  final int followerCount;
  final int followingCount;
  final DateTime? createdAt;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 用户唯一标识符 |
| `username` | String | ✅ | 用户名 |
| `avatar` | String? | ❌ | 头像 URL |
| `bio` | String? | ❌ | 个人简介 |
| `email` | String? | ❌ | 邮箱 |
| `phone` | String? | ❌ | 手机号 |
| `followerCount` | int | ✅ | 粉丝数 |
| `followingCount` | int | ✅ | 关注数 |
| `createdAt` | DateTime? | ❌ | 注册时间 |

**数据库表结构：**

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  avatar TEXT,
  bio TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
```

---

### 5. Comment (评论)

```dart
class Comment {
  final String id;
  final String articleId;
  final String userId;
  final String username;
  final String userAvatar;
  final String content;
  final String? parentId;
  final DateTime createTime;
  final int likeCount;
  final bool isLiked;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 评论唯一标识符 |
| `articleId` | String | ✅ | 所属文章 ID |
| `userId` | String | ✅ | 评论用户 ID |
| `username` | String | ✅ | 评论用户名 |
| `userAvatar` | String | ✅ | 评论用户头像 |
| `content` | String | ✅ | 评论内容 |
| `parentId` | String? | ❌ | 回复的评论 ID（楼中楼） |
| `createTime` | DateTime | ✅ | 评论时间 |
| `likeCount` | int | ✅ | 点赞数 |
| `isLiked` | bool | ❌ | 当前用户是否点赞（前端维护） |

**数据库表结构：**

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

---

### 6. ArticleInteraction (用户互动)

```dart
class ArticleInteraction {
  final String userId;
  final Set<String> likedArticles;
  final Set<String> bookmarkedArticles;
  final List<String> searchHistory;
  final List<String> viewHistory;
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userId` | String | ✅ | 用户 ID |
| `likedArticles` | Set<String> | ✅ | 点赞文章 ID 集合 |
| `bookmarkedArticles` | Set<String> | ✅ | 收藏文章 ID 集合 |
| `searchHistory` | List<String> | ✅ | 搜索历史列表 |
| `viewHistory` | List<String> | ✅ | 浏览历史列表 |

**本地存储（SharedPreferences）：**

```dart
// 存储格式：JSON
{
  "user_id": "xxx",
  "liked_articles": ["article_1", "article_2"],
  "bookmarked_articles": ["article_3"],
  "search_history": ["热搜词1", "热搜词2"],
  "view_history": ["article_1", "article_2", "article_3"]
}
```

---

## 🔄 数据流转

### 首页数据流转

```
用户打开首页
    ↓
请求 Banner 数据 (bannersProvider)
    ↓
请求文章列表 (articlesProvider)
    ↓
渲染 Banner 轮播 + 瀑布流列表
    ↓
用户下拉刷新
    ↓
重新请求数据
    ↓
更新 UI
```

### 点赞流程

```
用户点击点赞按钮
    ↓
HapticFeedback 触觉反馈
    ↓
更新本地 UI 状态
    ↓
动画效果
    ↓
调用 API 更新数据库
    ↓
更新成功 → 持久化状态
    ↓
更新失败 → 回滚 UI 状态
```

### 收藏流程

```
用户点击收藏按钮
    ↓
触觉反馈 + 动画
    ↓
更新收藏列表状态
    ↓
持久化到本地存储
    ↓
同步到云端（如果已登录）
```

---

## 🛠 数据转换

### JSON 序列化

```dart
// Article 模型
class Article {
  // ... 属性定义 ...

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      id: json['id'] as String,
      title: json['title'] as String,
      // ... 其他字段 ...
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      // ... 其他字段 ...
    };
  }
}
```

### Entity 转换

```dart
// 从 Supabase 数据转换为 Entity
class ArticleRepository {
  Future<List<Article>> getArticles() async {
    final response = await supabase.from('articles').select();
    
    return response.map((json) {
      return Article(
        id: json['id'],
        title: json['title'],
        // ... 字段映射 ...
      );
    }).toList();
  }
}
```

---

## 📦 Mock 数据

### Mock 数据文件

```dart
// mock_data.dart
class MockData {
  static List<Article> get articles => [
    Article(
      id: '1',
      title: '什么是"yyds"？',
      summary: 'yyds是"永远的神"的缩写...',
      content: '''
        yyds 是 "永远的神" 的拼音首字母缩写...

        ## 使用场景
        1. 追星时用来形容偶像
        2. 形容任何令人惊叹的事物
        3. 表达对某事物的崇拜

        ## 例句
        - 这个小姐姐的舞蹈真是 yyds！
        - 这部电影 yyds！
      ''',
      coverImage: 'https://example.com/cover1.jpg',
      author: '小明',
      authorAvatar: 'https://example.com/avatar1.jpg',
      publishTime: DateTime.now().subtract(Duration(hours: 2)),
      likeCount: 1234,
      commentCount: 56,
      viewCount: 5678,
      tags: ['网络用语', '流行语'],
    ),
    // ... 更多文章 ...
  ];

  static List<HotWord> get hotWords => [
    HotWord(
      id: '1',
      word: 'yyds',
      description: '永远的神，网络流行语...',
      heat: 9999,
      tags: ['热门', '网络用语'],
    ),
    // ... 更多热词 ...
  ];

  static List<BannerItem> get banners => [
    BannerItem(
      id: '1',
      title: '🔥 夏日热梗合集',
      image: 'https://example.com/banner1.jpg',
      type: BannerType.topic,
      link: '/topic/summer',
    ),
    // ... 更多 Banner ...
  ];
}
```

---

## 🔒 数据安全

### 用户隐私

- 敏感信息（密码、token）不在客户端存储
- 使用 HTTPS 传输所有数据
- 实现数据加密存储

### 内容安全

- 用户生成内容（UGC）需审核
- 敏感词过滤
- 违禁内容自动屏蔽

### 权限控制

- 未登录用户：仅可浏览
- 已登录用户：可点赞、收藏、评论
- 管理员：内容管理权限

---

> 📝 最后更新：2026-05-28
