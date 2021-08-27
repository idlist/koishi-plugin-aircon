const path = require('path')

const { s, Random } = require('koishi')
const { Mode, ModeCode } = require('./constants')

/**
 * @type {Record<string, import('./index').AirconData>}
 */
let ChannelData = {}

const fileImage = filePath => {
  return s('image', { url: 'file:///' + path.resolve(__dirname, filePath) })
}

const checkBoundary = (temp, mode) => {
  if (temp < -273) return '群空调无法设置到绝对零度以下。'
  else if (temp > 5500) return '群空调无法设置到太阳表面的温度以上。'
  else if (mode == 1 && temp > 30) return '群空调在制冷模式下最高温度为 30℃。'
  else if (mode == 2 && temp < 16) return '群空调在制热模式下最低温度为 16℃。'
  else return undefined
}

class AirconSettings {
  constructor(aircon) {
    aircon = { ...aircon }
    this.status = aircon.status ?? false
    this.mode = aircon.mode >= 1 && aircon.mode <= 4 ? aircon.mode : 1
    this.temperature = aircon.temperature ?? 26
  }
}

module.exports = async (session, command, rest, useDatabase) => {
  /**
   * @type { import('./index').Channel }
   */
  let channel

  if (useDatabase) {
    channel = await session.observeChannel(['aircon'])
  } else {
    channel = ChannelData[`${session.platform}:${session.channelId}`]
    if (!channel) {
      channel = {}
      ChannelData[`${session.platform}:${session.channelId}`] = channel
    }
  }
  let aircon = new AirconSettings(channel.aircon ?? {})
  channel.aircon = aircon

  switch (command) {
    case undefined:
      return session.execute({ name: 'help', args: ['aircon'] })

    case 'show':
    case 'stat':
    case 'status':
      if (aircon.status) {
        return fileImage(`./image/aircon${Random.int(1, 2)}.jpg`)
          + `\n群空调已开启，当前模式为${Mode[aircon.mode]}，设定温度为 ${aircon.temperature} ℃。`
      } else {
        return '群空调已关闭。'
      }

    case 'on':
      if (aircon.status) {
        return '群空调已处于开启状态。'
      } else {
        channel.aircon.status = true
        return fileImage(`./image/aircon${Random.int(1, 4)}_on${aircon.mode}.jpg`)
          + `\n群空调已开启，当前模式为${Mode[aircon.mode]}，设定温度为 ${aircon.temperature}℃。`
      }

    case 'off':
      if (aircon.status) {
        channel.aircon.status = false
        return fileImage(`./image/aircon${Random.int(1, 4)}_off.jpg`)
      } else {
        return '群空调已处于关闭状态。'
      }

    case 'mode':
      if (aircon.status) {
        let mode = rest[0]
        if (!mode) return '未设置模式。'
        mode = ModeCode[mode]

        channel.aircon.mode = mode
        let info = ''
        if (mode == 1 && channel.aircon.temperature > 30) {
          channel.aircon.temperature = 30
          info = '由于温度限制，群空调已重置为 30℃'
        }
        if (mode == 2 && channel.aircon.temperature < 16) {
          channel.aircon.temperature = 16
          info = '由于温度限制，群空调已重置为 16℃'
        }
        return fileImage(`./image/aircon${Random.int(1, 4)}_on${aircon.mode}.jpg`)
          + `群空调已设置为${Mode[aircon.mode]}模式。` + info
      } else {
        return '群空调目前处于关闭状态。'
      }

    case 'set':
      if (aircon.status) {
        let temp = parseInt(rest[0].trim())
        if (isNaN(temp)) return '设置的温度无效。'

        const check = checkBoundary(temp, aircon.mode)
        if (check) return check

        let formerTemp = aircon.temperature
        channel.aircon.temperature = temp
        if (temp < formerTemp) {
          return fileImage('./image/aircon_temp_down.jpg')
            + `群空调已设置为 ${temp}℃。`
        } else if (temp > formerTemp) {
          return fileImage('./image/aircon_temp_up.jpg')
            + `群空调已设置为 ${temp}℃。`
        } else {
          return '群空调的温度没有变化。'
        }
      } else {
        return '群空调目前处于关闭状态。'
      }

    case 'up': {
      if (aircon.status) {
        let temp = aircon.temperature + 1

        const check = checkBoundary(temp, aircon.mode)
        if (check) return check

        channel.aircon.temperature = temp
        return fileImage('./image/aircon_temp_up.jpg')
          + `群空调已设置为 ${temp}℃。`
      } else {
        return '群空调目前处于关闭状态。'
      }
    }

    case 'down':
      if (aircon.status) {
        let temp = aircon.temperature - 1

        const check = checkBoundary(temp)
        if (check) return check

        channel.aircon.temperature = temp
        return fileImage('./image/aircon_temp_down.jpg')
          + `群空调已设置为 ${temp}℃。`
      } else {
        return '群空调目前处于关闭状态。'
      }
    default:
      return '不能这么控制群空调。'
  }
}