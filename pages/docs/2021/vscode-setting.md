---
date: 2021-09-28T16:00:00.000+00:00
title: vscode 常用设置与技巧
todoNext:
  - 内容过少
  - 继续积累
duration: 1min
wordCount: 58
---

## 常用设置

```json
{
  // 设置 vscode 的默认 shell
  "terminal.integrated.defaultProfile.linux": "zsh",
  // 搜索时排除的路径
  "search.exclude": {
    "**/*.code-search": true,
    "**/bower_components": true,
    "**/node_modules": false,
    "**/node_moduless": true
  },
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "Visual Studio Dark",
  "workbench.preferredLightColorTheme": "Visual Studio Light",
  "workbench.colorTheme": "Visual Studio Light",
  "window.nativeTabs": true,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay"
}
```
