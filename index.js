const path = require('path')

const { s, Random } = require('koishi-core')
require('./database')

const fileImage = filePath => {
  return s('image', { url: 'file:///' + path.resolve(__dirname, filePath) })
}

const Modes = {
  1: '制冷',
  2: '制热',
  3: '送风',
  4: '除湿'
}

class AirconSettings {
  constructor(aircon) {
    aircon = { ...aircon }
    this.status = aircon.status ?? false
    this.mode = Object.keys(Modes).includes(aircon.mode) ? aircon.mode : 1
    this.temperature = aircon.temperature ?? 26
  }
  descMode() {
    return `目前模式为${Modes[this.mode]}，设定温度为 ${this.temperature} ℃。`
  }
}

class Config {
  constructor(config) {
    this.useDatabase = (config && config.useDatabase) ?? true
  }
}

module.exports = (ctx, config) => {
  ctx = ctx.group()
  config = new Config(config)

  const AirconCommand = ctx
    .command('aircon <command>', '群空调')
    .example('aircon show  查看群空调')
    .example('aircon on  打开群空调')
    .example('aircon off  关闭群空调')
    .example('aircon mode <mode name>  设置群空调模式')
    .example('aircon set <temperature>  设置群空调温度')
    .example('aircon up  将温度调高一度')
    .example('aircon down  将温度调低一度')
    .channelFields(['aircon'])

  AirconCommand.action(async ({ session }, command, ...rest) => {
    const channel = await session.observeChannel(['aircon'])
    let aircon = new AirconSettings(channel.aircon)

    switch (command) {
      case 'show':
      case 'status':
        if (aircon.status) {
          return fileImage(`./image/aircon${Random.int(1, 2)}.jpg`)
            + '\n群空调已开启，' + aircon.descMode()
        } else {
          return '群空调已关闭。'
        }
      case 'on':
        if (aircon.status) {
          return '群空调已处于开启状态。'
        } else {
          aircon.status = true
          channel.aircon = aircon
          return fileImage(`./image/aircon${Random.int(1, 4)}_on${aircon.mode}.jpg`)
            + '\n群空调已开启，' + aircon.descMode()
        }
      case 'off':
        if (aircon.status) {
          aircon.status = false
          channel.aircon = aircon
          return fileImage(`./image/aircon${Random.int(4)}_off.jpg`)
            + '群空调已关闭。'
        } else {
          return '群空调已处于关闭状态。'
        }
      case 'mode':
      case 'set':
      case 'up':
      case 'down':
      default:
        return '不能这么操作群空调。'
    }
  })
}