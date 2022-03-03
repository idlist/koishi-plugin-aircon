const { Schema: S } = require('koishi')
const core = require('./src/core')

module.exports.name = 'aircon'

module.exports.schema = S.object({
  useDatabase: S.boolean().default(true)
    .description('是否使用数据库。在没有配置数据库的情况下，即使打开这个选项为也无法启用数据库。'),
  useDefaultShortcut: S.boolean().default(true)
    .description('是否使用默认快捷方式。'),
})

/**
 * @param {import('koishi').Context} ctx
 * @param {import('./index').ConfigObject} config
 */
module.exports.apply = (ctx, config) => {
  config = {
    useDatabase: true,
    useDefaultShortcut: true,
    ...config,
  }

  ctx = ctx.guild()

  ctx.on('ready', () => {
    ctx.plugin(core, { ...config, useDatabase: false })
  })

  ctx.on('service', name => {
    if (name === 'database' && config.useDatabase) {
      ctx.dispose(core)

      if (ctx.database) {
        ctx.plugin(core, config)
      } else {
        ctx.plugin(core, { ...config, useDatabase: false })
      }
    }
  })
}