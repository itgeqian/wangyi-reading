# 网易云阅读网站

一个基于HTML、CSS、JavaScript开发的在线阅读平台，模仿网易云阅读的界面设计和功能。

## 🌟 项目特色

- **响应式设计**：支持桌面端、平板和移动端
- **现代化界面**：简洁美观的用户界面
- **完整功能**：搜索、购物车、商品详情等
- **模块化代码**：清晰的代码结构，易于维护
- **本地存储**：购物车和订单数据持久化

## 📁 项目结构

```
├── index.html              # 首页
├── details.html            # 商品详情页
├── shopCar.html           # 购物车页面
├── package.json           # 项目配置
├── README.md              # 项目说明
├── css/
│   └── sass/              # 编译后的CSS文件
├── sass/                  # SASS源文件
│   ├── index.scss         # 首页样式
│   ├── details.scss       # 详情页样式
│   ├── shopCar.scss       # 购物车样式
│   └── responsive.scss    # 响应式样式
├── js/                    # JavaScript文件
│   ├── index.js           # 首页逻辑
│   ├── details.js         # 详情页逻辑
│   ├── shopCar.js         # 购物车逻辑
│   ├── api.js             # 数据接口
│   ├── utils.js           # 工具函数
│   ├── cart.js            # 购物车管理
│   ├── Ajax.js            # Ajax封装
│   └── Jsonp.js           # JSONP封装
├── img/                   # 图片资源
└── iconf/                 # 图标字体
```

## 🚀 快速开始

### 环境要求

- Node.js 14.0+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 监听SASS文件变化
npm run sass:watch
```

### 构建项目

```bash
# 编译SASS文件
npm run build
```

### 启动服务器

```bash
# 使用http-server启动
npm run serve
```

## 🎯 主要功能

### 1. 首页功能
- 轮播图展示
- 商品分类导航
- 热门推荐
- 搜索功能（集成百度搜索API）
- 响应式布局

### 2. 商品详情
- 商品信息展示
- 评分系统
- 相关推荐
- 加入购物车

### 3. 购物车系统
- 添加/删除商品
- 数量调整
- 价格计算
- 本地存储
- 订单结算

### 4. 搜索功能
- 实时搜索建议
- 防抖优化
- 历史记录

## 🛠️ 技术栈

- **前端框架**：原生JavaScript
- **样式预处理**：SASS/SCSS
- **UI组件**：Swiper轮播图
- **图标字体**：Iconfont
- **构建工具**：Sass编译器
- **开发服务器**：Live Server

## 📱 响应式设计

项目采用移动优先的响应式设计：

- **移动端**：< 768px
- **平板端**：768px - 1024px  
- **桌面端**：> 1024px

## 🔧 代码规范

### JavaScript规范
- 使用ES6+语法
- 模块化设计
- 事件委托
- 错误处理

### CSS规范
- BEM命名规范
- SASS嵌套
- 变量管理
- 媒体查询

## 📊 性能优化

- 图片懒加载
- 防抖节流
- 事件委托
- 本地存储缓存
- CSS压缩

## 🐛 已知问题

1. 部分图片路径可能需要调整
2. 搜索API需要配置CORS
3. 移动端菜单需要进一步优化

## 🔮 后续计划

- [ ] 添加用户登录系统
- [ ] 实现书籍阅读功能
- [ ] 添加评论系统
- [ ] 集成支付功能
- [ ] 添加后台管理
- [ ] 数据库集成
- [ ] PWA支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接：[https://github.com/yourusername/netease-reading-website](https://github.com/yourusername/netease-reading-website)
- 问题反馈：[Issues](https://github.com/yourusername/netease-reading-website/issues)

## 🙏 致谢

- 网易云阅读提供设计灵感
- Swiper提供轮播组件
- Iconfont提供图标资源

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 