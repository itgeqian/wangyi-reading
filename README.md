这是一个JavaScript的期末大作业，页面仿照网易云阅读进行改造
## 📖 项目概述

这是一个基于HTML+CSS+JS的网易云阅读网站项目，包含首页(index.html)、详情页(details.html)、购物车页(shopCar.html)、登录页(login.html)、注册页(register.html)等核心页面，使用了SASS预处理器、jQuery、Swiper轮播组件等技术。
## 🏗️ 项目结构

```
app/
├── index.html                      # 首页
├── details.html                    # 书籍详情页
├── shopCar.html                   # 购物车页面
├── login.html                     # 登录页面
├── register.html                  # 注册页面
├── demo.html                      # 项目演示页面
├── design-gallery.html            # 设计稿展示页面
├── package.json                   # 项目配置
├── PROJECT_COMPLETE_GUIDE.md      # 完整开发文档
├── css/
│   └── sass/
│       ├── index.css              # 首页样式
│       ├── details.css            # 详情页样式
│       ├── shopCar.css            # 购物车样式
│       ├── cart-modern.css        # 现代化购物车样式
│       ├── auth.css               # 登录注册样式
│       ├── improvements.css       # 界面改进样式
│       ├── responsive.css         # 响应式样式
│       └── public.css             # 公共样式
├── js/
│   ├── index.js                   # 首页逻辑
│   ├── details.js                 # 详情页逻辑
│   ├── cart.js                    # 购物车核心逻辑
│   ├── shopCar.js                 # 购物车页面逻辑
│   ├── auth.js                    # 用户认证系统
│   ├── utils.js                   # 工具函数库
│   ├── category-menu.js           # 分类菜单功能
│   ├── humor-alerts.js            # 幽默弹窗系统
│   ├── project-announcement.js    # 项目演示公告系统
│   ├── api.js                     # API接口封装
│   ├── Ajax.js                    # Ajax工具
│   ├── Jsonp.js                   # JSONP工具
│   ├── jquery-2.1.0.js           # jQuery库
│   ├── modules/                   # 功能模块目录
│   ├── pages/                     # 页面相关脚本
│   └── utils/                     # 工具类目录
├── img/                           # 图片资源
│   ├── img/                       # 子图片目录
│   ├── *.jpg                      # 各种图片文件
│   ├── *.png                      # PNG格式图片
│   └── ...                       # 其他图片资源
├── 设计稿/                        # 设计稿目录
│   ├── index.html                 # 首页设计稿
│   ├── details.html               # 详情页设计稿
│   ├── shopCar.html               # 购物车设计稿
│   ├── login.html                 # 登录页设计稿
│   └── register.html              # 注册页设计稿
├── sass/                          # SASS源文件目录
├── iconf/                         # 图标字体目录
└── test_*.html                    # 各种测试页面
    ├── test_auth.html             # 认证系统测试页面
    └── test_cart_login.html       # 购物车登录测试页面
```

---
##测试图
登录界面
![image](https://github.com/user-attachments/assets/591b93eb-fb5b-493e-aea0-15f40a194c5d)
注册界面
![image](https://github.com/user-attachments/assets/139bd0a1-249a-4fa1-b2b4-e4b5f04781b7)


首页界面
![image](https://github.com/user-attachments/assets/2fec8fa2-b971-499e-a372-da49275264e0)


书籍详情界面
![image](https://github.com/user-attachments/assets/8796b289-1f99-423e-b2ea-13de212904b3)



购物车界面
![image](https://github.com/user-attachments/assets/5a0d34d0-b1d4-4029-800b-38667b3cfc3c)
![image](https://github.com/user-attachments/assets/01427959-c663-453c-938a-66e174a688cc)




公告弹窗
![image](https://github.com/user-attachments/assets/4622e4b7-b0c0-4670-a9a6-d0f27fd88144)



未实现功能的弹窗
![image](https://github.com/user-attachments/assets/cc58fc27-5892-49b2-ba3e-e528e455e03a)
![image](https://github.com/user-attachments/assets/b29ae71a-150e-4c63-bb98-cae27c8e98c2)
![image](https://github.com/user-attachments/assets/3adcb791-42bf-4a1e-8260-7eaffdd1d4df)




