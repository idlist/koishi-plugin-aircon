const aircon = require('./aircon')
require('./database')

class Config {
  constructor(config) {
    config = { ...config }
    this.useDatabase = config.useDatabase ?? true
    this.useDefaultShortcut = config.useDefaultShortcut ?? false
    this.shortcut = config.shortcut ?? []
  }
}

module.exports.name = 'aircon'

module.exports.apply = (ctx, config) => {
  ctx = ctx.group()
  config = new Config(config)

  ctx.on('connect', () => {
    if (!ctx.database) config.useDatabase = false
  })

  const AirconCommand = ctx
    .command('aircon <command>', '群空调')
    .channelFields(['aircon'])

  if (config.useDefaultShortcut) {
    AirconCommand
      .example('查看群空调')
      .example('打开群空调')
      .example('关闭群空调')
      .example('设置群空调制冷 / 制热 / 送风 / 除湿')
      .example('设置群空调 <一个数字> 度')
      .example('调高群空调')
      .example('调低群空调')
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
  } else {
    AirconCommand
      .example('aircon show  查看群空调')
      .example('aircon on  打开群空调')
      .example('aircon off  关闭群空调')
      .example('aircon mode <name>  设置群空调模式 (cool, warm, wind, dehumid)')
      .example('aircon set <temp>  设置群空调温度')
      .example('aircon up  将温度调高 1 度')
      .example('aircon down  将温度调低 1 度')

    config.shortcut.forEach(item => {
      AirconCommand.shortcut(item[0], item[1])
    })
  }

  AirconCommand.action(({ session }, command, ...rest) => {
    return aircon(session, command, rest, config.useDatabase)
  })
}