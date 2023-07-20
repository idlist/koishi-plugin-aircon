# koishi-plugin-aircon

[![npm](https://img.shields.io/npm/v/koishi-plugin-aircon?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-aircon)
[![npm-download](https://img.shields.io/npm/dw/koishi-plugin-aircon?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-aircon)

一个用于 **[Koishi v4](https://github.com/koishijs/koishi)** 的给群里开空调的插件。

## 安装方法

```shell
npm i koishi-plugin-aircon
```

然后在配置文件或入口文件中将插件添加至你的机器人中。

## 使用方法

```
aircon <command>
```

使用 `aircon -h` 或 `help aircon` 或 `aircon` 查看可用的 `command` 。

在检测到启用了数据库的情况下，该插件会使用数据库进行数据储存，否则会使用临时变量进行储存。

## 插件配置项

这个插件无需任何配置项即可使用，同时也提供了一些可能会用到的配置项。一些不太可能会用到的配置项就摸了。

| 配置项 | 默认值  | 说明 |
| - | - | - |
| `useDatabase` | `true` | 是否使用数据库。在未安装数据库的情况下即使手动指定为 `true` 也不会启用数据库。|
| `useDefaultShortcut` | `true` | 是否使用默认的指令捷径。 **\*1** |

**\*1** 这些快捷定义于 [这里](https://github.com/idlist/koishi-plugin-aircon/blob/main/src/core.js#L14)。

如果你不喜欢无前缀触发指令，或者想自定义快捷方式，可以将配置项设置为 `false` 。

如果想要自定义快捷方式，请参照 [快捷方式](https://koishi.js.org/guide/command/execution.html#%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F) 一节自定义快捷方式。

## Q&A

- 想要更多功能！

未来可能在正式版中加入随机事件，但这取决于作者咕咕咕咕咕咕。（但是过了这么久都没加，估计是没戏了。）

- 发现了个 bug！

这很正常。

## 更新记录

<details>
<summary><b>v1.0</b> （用于 Koishi v4）</summary>

### v1.1.1

- 从 `segment` 换用为 `h`，现在大概有正常的换行了。
- 修复了无法给空调设置负数温度的问题。

### v1.1.0

*此插件需要 Koishi 版本至少为 v4.9。如有需要，请使用 v1.0.1。*

- 重载逻辑使用的事件从 `service` 变更为 `internal/service`
- 新增 `package.json` 中的 `koishi` 字段。

### v1.0.1

- 修正了文档中的一个错误。

### v1.0.0

- 对 v4 做了简单的适配，增加了 Schema。

  如果需要继续用于 v3，请使用 v0.1 版本。

</details>