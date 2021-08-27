import { Context } from 'koishi'

export interface AirconData {
  status: boolean
  mode: number
  temperature: number
}

export interface Channel {
  aircon: AirconData
}

export interface ConfigObject {
  /**
   * Use database to save the state of aircon.
   *
   * If set to `false`, a variable would hold the state of aircon.
   *
   * @default true
   */
  useDatabase?: boolean
  /**
   * Use default shortcuts.
   *
   * @default false
   */
  useDefaultShortcut?: boolean
}

export const apply: (ctx: Context, config: ConfigObject) => void