import { Session } from 'koishi'
import { ChannelData } from './database'

declare namespace Aircon {
  export interface AirconOptions {
    useDatabase: boolean
  }
}

declare class Aircon {
  channel: ChannelData
  constructor(channel: ChannelData)
  static init(session: Session, options: Aircon.AirconOptions): Promise<Aircon>
  show(): string
  on(): string
  off(): string
  mode(name: string): string
  set(temperature: string): string
  up(): string
  down(): string
}

export = Aircon