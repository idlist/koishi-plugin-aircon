declare module 'koishi' {
  interface Channel {
    aircon: AirconData
  }
}

export interface AirconData {
  status: boolean
  mode: number
  temperature: number
}

export interface ChannelData {
  aircon: AirconData
}