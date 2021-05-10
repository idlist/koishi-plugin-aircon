const { readFile } = require('fs/promises')

const { s } = require('koishi-core')
require('./database')

const Modes = {
  1: '制冷',
  2: '制热',
  3: '送风',
  4: '干燥'
}

class AirconSetting {
  constructor(aircon) {
    aircon = { ...aircon }
    this.status = aircon.status ?? false
    this.mode = Object.keys(Modes).includes(aircon.mode) ? aircon.mode : 1
    this.temperature = aircon.temperature ?? 26
  }
}

module.exports = ctx => {
  ctx = ctx.group()
  const fields = ['aircon']

  const Aircon = ctx.command('aircon <command>', '群空调')
    .example('aircon show  查看群空调')
    .example('aircon on  打开群空调')
    .example('aircon off  关闭群空调')
    .example('aircon mode <mode name>  设置群空调模式')
    .example('aircon set <temperature>  设置群空调温度')
    .example('aircon up  将温度调高一度')
    .example('aircon down  将温度调低一度')
    .channelFields(fields)

  Aircon.action(async ({ session }, command, ...rest) => {
    const db = session.database
    const platform = session.platform
    const groupId = session.groupId

    let aircon = (await db.getChannel(platform, groupId, fields)).aircon
    aircon = new AirconSetting(aircon)
    console.log(aircon)

    switch (command) {
      case 'show':
        if (aircon.status) {
          return `群空调已开启，目前模式为${Modes[aircon.mode]}，温度为 ${aircon.temperature} ℃。`
        } else {
          return '群空调已关闭。'
        }
      case 'on':
        if (!aircon.status) {
          aircon.status = true
          const image = await readFile(__dirname + '/image/aircon_start.jpg')
          return s('image', { url: `base64://${image.toString('base64')}` })
           + `\n群空调已开启，目前模式为${Modes[aircon.mode]}，温度为 ${aircon.temperature} ℃`
        } else {
          return '群空调已处于开启状态。'
        }
      case 'off':
      case 'mode':
      case 'set':
      case 'up':
      case 'down':
      default:
        return '不能这么操作群空调。'
    }
  })
}