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
   * 是否使用数据库来储存群空调状态。
   *
   * 在 `false` 的情况下，将使用运行时的变量储存状态。
   *
   * @default true
   */
  useDatabase?: boolean
  /**
   * 是否使用默认快捷方式。
   *
   * @default false
   */
  useDefaultShortcut?: boolean
}

export const apply: (ctx: Context, config: ConfigObject) => void