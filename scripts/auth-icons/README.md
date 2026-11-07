# 登录页字体图标

字体名称：`VkAuthIconsV2`。图标采用原始 SVG 轮廓生成，无外部图标字体依赖。字体名称和文件名均带版本，避免页面继续使用内存中已加载的旧字形。

| 字符     | 名称         | 用途           |
| -------- | ------------ | -------------- |
| `\ue001` | brand        | 双斜块品牌标记 |
| `\ue002` | back         | 返回           |
| `\ue003` | eye          | 显示密码       |
| `\ue004` | eye-off      | 隐藏密码       |
| `\ue005` | wechat       | 微信登录       |
| `\ue006` | circle       | 协议未勾选     |
| `\ue007` | check-circle | 协议已勾选     |

重新生成：安装 `fonttools` 后运行 `python scripts/auth-icons/generate.py`。
输出位置为 `pages/login/static/fonts/vk-auth-icons-v2.ttf`。SVG 与生成器不位于静态资源目录内。
