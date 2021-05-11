# koishi-plugin-aircon

[![npm](https://img.shields.io/npm/v/koishi-plugin-aircon?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-aircon)
[![npm-download](https://img.shields.io/npm/dw/koishi-plugin-aircon?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-aircon)

一个用于 **[Koishi v3](https://github.com/koishijs/koishi)** 的给群里开空调的插件。

## 安装方法

```shell
npm i koishi-plugin-aircon
```

然后参照 [安装插件](https://koishi.js.org/guide/context.html#%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B6) 继续安装。

## 使用方法

```
aircon <command>
```

使用 `aircon -h` 或 `help aircon` 查看可用的 `command` 。

在检测到启用了数据库的情况下，该插件会使用数据库进行数据储存，否则会使用临时变量进行储存。

## 插件配置项

这个插件无需任何配置项即可使用，同时也提供了一些可能会用到的配置项。一些不太可能会用到的配置项就摸了。

| 配置项               | 默认值  | 说明                                                         |
| -------------------- | ------- | ------------------------------------------------------------ |
| `useDatabase`        | `true`  | 是否使用数据库。手动将其设置为 `false` 可在安装了数据库的情况下不使用数据库。（不过 `aircon` 字段好像还是会新增） |
| `useDefaultShortcut` | `false` | 是否使用默认的指令捷径。 **\*1**                             |
| `shortcut`           | `[]`    | 自定义指令捷径。 **\*2**                                     |

**\*1** 这些快捷方式长这样。

```js
command
  .shortcut('查看群空调', { args: ['show'] })
  .shortcut('打开群空调', { args: ['on'] })
  .shortcut('关闭群空调', { args: ['off'] })
  .shortcut('设置群空调制冷', { args: ['mode', 'cool'] })
  .shortcut('设置群空调制热', { args: ['mode', 'warm'] })
  .shortcut('设置群空调送风', { args: ['mode', 'wind'] })
  .shortcut('设置群空调除湿', { args: ['mode', 'dehumid'] })
  .shortcut(/^设置群空调(.+)摄氏度$/, { args: ['set', '$1'] })
  .shortcut(/^设置群空调(.+)(度|℃)$/, { args: ['set', '$1'] })
  .shortcut('调高群空调', { args: ['up'] })
  .shortcut('调低群空调', { args: ['down'] })
```

考虑到有的人不喜欢无前缀触发指令，或者想自定义快捷方式，这个配置项被默认设置为 `false` 。

**\*2** `shortcut` 的示例形式为：

```js
shortcut = [
  ['查看群空调', { args: ['show'] }],
  ['设置群空调制冷', { args: ['mode', 'cool'] }],
  [/^设置群空调(.+)(度|℃)$/, { args: ['set', '$1'] }]
]
```

请参照 [快捷方式](https://koishi.js.org/guide/execute.html#快捷方式) 一节设置自定义的快捷方式。不配置此项而是使用 `ctx.command` 复写自定义的快捷方式也是可以的。

## Q&A

- 想要更多功能！

未来可能在正式版中加入随机事件，但这取决于作者咕咕咕咕咕咕。

- 发现了个 bug！

你看看版本号，这很正常。