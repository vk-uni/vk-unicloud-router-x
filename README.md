# vk-unicloud-router-x

**vk 框架的 uni-app x 蒸汽模式版本。**

基于 uni-app x 和 uniCloud 的企业级全栈开发框架，提供登录注册、云端接口调用、数据库操作等常用能力，助你快速构建云开发应用。

## 版本选择

| 版本                     | 插件市场地址                                                            |
| ------------------------ | ----------------------------------------------------------------------- |
| **uni-app x 蒸汽模式版** | [跳转插件市场](https://ext.dcloud.net.cn/plugin?name=vk-cloud-router-x) |
| uni-app 版               | [跳转插件市场](https://ext.dcloud.net.cn/plugin?name=vk-cloud-router)   |

## Git 仓库地址

| 版本                     | 国内访问                                                         | 海外访问                                                               |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **uni-app x 蒸汽模式版** | [跳转 Gitee 仓库](https://gitee.com/vk-uni/vk-unicloud-router-x) | [跳转 GitHub 仓库](https://github.com/vk-uni/vk-unicloud-router-x.git) |
| uni-app 版               | [跳转 Gitee 仓库](https://gitee.com/vk-uni/vk-uni-cloud-router)  | [跳转 GitHub 仓库](https://github.com/vk-uni/vk-unicloud-router)       |

## 框架文档

- [client 端框架文档](https://vkdoc.fsq.pub/client/)
- [admin 端框架文档](https://vkdoc.fsq.pub/admin/)

## 快速开始

1. 下载或克隆本项目，使用支持 **uni-app x 蒸汽模式** 的 HBuilderX 打开。
2. 在 `manifest.json` 中填写自己的应用信息；开发微信小程序时，填写自己的小程序 AppID。
3. 右键 `uniCloud` 目录，选择「云服务空间初始化向导」，按提示选择服务空间并完成初始化。
4. 在 HBuilderX 中运行项目，点击首页的「查看框架演示」，体验示例功能。

## 从哪里开始开发

| 文件或目录                                | 用途                             |
| ----------------------------------------- | -------------------------------- |
| `pages/`                                  | 编写自己的页面                   |
| `pages_template/`                         | 查看框架演示和示例代码（可删除） |
| `app.config.js`                           | 修改前端框架配置                 |
| `uniCloud/cloudfunctions/router/service/` | 编写后端业务逻辑                 |
| `uniCloud/database/`                      | 管理数据库结构和初始数据         |
