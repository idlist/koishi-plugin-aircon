const Aircon = require('./aircon')

/**
 * @param {import('koishi').Context} ctx
 * @param {import('../index').Config} config
 */
module.exports = (ctx, config) => {
  if (config.useDatabase) ctx.plugin(require('./database'))

  const AirconCommand = ctx
    .command('aircon <commands:text>', '群空调')
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
      .shortcut('群空调', { args: [] })
      .shortcut('查看群空调', { args: ['show'] })
      .shortcut('打开群空调', { args: ['on'] })
      .shortcut('开启群空调', { args: ['on'] })
      .shortcut('关闭群空调', { args: ['off'] })
      .shortcut('设置群空调制冷', { args: ['mode cool'] })
      .shortcut('设置群空调制热', { args: ['mode warm'] })
      .shortcut('设置群空调送风', { args: ['mode wind'] })
      .shortcut('设置群空调除湿', { args: ['mode dehumid'] })
      .shortcut(/^设置群空调(.+)摄氏度$/, { args: ['set $1'] })
      .shortcut(/^设置群空调(.+)(度|℃)$/, { args: ['set $1'] })
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
  }

  AirconCommand.action(async ({ session }, commands) => {
    const args = commands ? commands.split(' ') : []
    const command = args[0]
    const rest = args.length > 1 ? args.slice(1) : []

    const aircon = await Aircon.init(session, {
      useDatabase: config.useDatabase,
    })

    switch (command) {
      case undefined:
        return session.execute('help aircon')
      case 'show':
      case 'stat':
      case 'status':
        return aircon.show()
      case 'on':
        return aircon.on()
      case 'off':
        return aircon.off()
      case 'mode':
        return aircon.mode(rest[0])
      case 'set':
        return aircon.set(rest[0])
      case 'up':
        return aircon.up()
      case 'down':
        return aircon.down()
      default:
        return '不能这么控制群空调。'
    }
  })
}