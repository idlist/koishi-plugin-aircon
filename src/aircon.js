const { resolve } = require('path')

const { segment, Random } = require('koishi')
const { Mode, ModeCode } = require('./constants')

/**
 * @param {string} filePath
 */
const fileImage = filePath => {
  return segment('image', { url: 'file:///' + resolve(__dirname, '../image', filePath) })
}

/**
 * @param {number} temp
 * @param {number} mode
 * @returns {string?} outbound message if outbounded, otherwise null
 */
const checkBoundary = (temp, mode) => {
  if (temp < -273) return '群空调无法设置到绝对零度以下。'
  else if (temp > 5500) return '群空调无法设置到太阳表面的温度以上。'
  else if (mode == 1 && temp > 30) return '群空调在制冷模式下最高温度为 30℃。'
  else if (mode == 2 && temp < 16) return '群空调在制热模式下最低温度为 16℃。'
  else return null
}

/**
 * @type {Record<string, import('./database').AirconData>}
 */
const AirconData = {}

/**
 * @param {import('./database').AirconData} aircon
 */
const validateAircon = aircon => {
  aircon.status = aircon.status ?? false
  aircon.mode = aircon.mode >= 1 && aircon.mode <= 4 ? aircon.mode : 1
  aircon.temperature = aircon.temperature ?? 26
  return aircon
}

/**
 * @type {import('./aircon').Aircon}
 */
class Aircon {
  /**
   * @param {import('./database').ChannelData} channel
   */
  constructor(channel) {
    this.channel = channel
    const aircon = validateAircon(channel.aircon ?? {})
    channel.aircon = aircon
  }

  /**
   * @param {import('koishi').Session} session
   * @param {import('./aircon').AirconOptions} options
   */
  static async init(session, options) {
    let channel
    if (options.useDatabase) {
      channel = await session.observeChannel(['aircon'])
    } else {
      channel = AirconData[session.cid]
      if (!channel) {
        channel = {}
        AirconData[session.cid] = channel
      }
    }

    return new Aircon(channel)
  }

  show() {
    const aircon = this.channel.aircon

    if (aircon.status) {
      return fileImage(`aircon${Random.int(1, 2)}.jpg`) +
        `\n群空调已开启，当前模式为${Mode[aircon.mode]}，设定温度为 ${aircon.temperature} ℃。`
    } else {
      return '群空调已关闭。'
    }
  }

  on() {
    const aircon = this.channel.aircon

    if (aircon.status) {
      return '群空调已处于开启状态。'
    } else {
      this.channel.aircon.status = true
      return fileImage(`aircon${Random.int(1, 4)}_on${aircon.mode}.jpg`) +
        `\n群空调已开启，当前模式为${Mode[aircon.mode]}，设定温度为 ${aircon.temperature}℃。`
    }
  }

  off() {
    const aircon = this.channel.aircon

    if (!aircon.status) {
      return '群空调已处于关闭状态。'
    } else {
      this.channel.aircon.status = false
      return fileImage(`aircon${Random.int(1, 4)}_off.jpg`)
    }
  }

  /**
   * @param {string} name
   */
  mode(name) {
    const aircon = this.channel.aircon

    if (!name) {
      return '未设置模式。'
    }
    else if (!aircon.status) {
      return '群空调目前处于关闭状态。'
    } else {
      const mode = ModeCode[name]

      this.channel.aircon.mode = mode
      let info = ''
      if (mode == 1 && aircon.temperature > 30) {
        this.channel.aircon.temperature = 30
        info = '由于温度限制，群空调已重置为 30℃'
      }
      if (mode == 2 && aircon.temperature < 16) {
        this.channel.aircon.temperature = 16
        info = '由于温度限制，群空调已重置为 16℃'
      }
      return fileImage(`aircon${Random.int(1, 4)}_on${aircon.mode}.jpg`) +
        `\n群空调已设置为${Mode[aircon.mode]}模式。` + info
    }
  }

  /**
   * @param {string} temp
   */
  set(temp) {
    const aircon = this.channel.aircon

    if (!aircon.status) {
      return '群空调目前处于关闭状态。'
    } else {
      temp = parseInt(temp)
      if (isNaN(temp)) return '设置的温度无效。'

      const outboundMessage = checkBoundary(temp, aircon.mode)
      if (outboundMessage) return outboundMessage

      const formerTemp = aircon.temperature
      this.channel.aircon.temperature = temp
      if (temp < formerTemp) {
        return fileImage('aircon_temp_down.jpg') +
          `群空调已设置为 ${temp}℃。`
      } else if (temp > formerTemp) {
        return fileImage('aircon_temp_up.jpg') +
          `群空调已设置为 ${temp}℃。`
      } else {
        return '群空调的温度没有变化。'
      }
    }
  }

  up() {
    const aircon = this.channel.aircon

    if (!aircon.status) {
      return '群空调目前处于关闭状态。'
    } else {
      const temp = aircon.temperature + 1

      const outboundMessage = checkBoundary(temp, aircon.mode)
      if (outboundMessage) return outboundMessage

      this.channel.aircon.temperature = temp
      return fileImage('aircon_temp_up.jpg') +
        `群空调已设置为 ${temp}℃。`
    }
  }

  down() {
    const aircon = this.channel.aircon

    if (!aircon.status) {
      return '群空调目前处于关闭状态。'
    } else {
      const temp = aircon.temperature - 1

      const outboundMessage = checkBoundary(temp)
      if (outboundMessage) return outboundMessage

      this.channel.aircon.temperature = temp
      return fileImage('aircon_temp_down.jpg') +
        `群空调已设置为 ${temp}℃。`
    }
  }
}

module.exports = Aircon