/**
 * @param {import('koishi').Context} ctx
 */
module.exports = ctx => {
  ctx.model.extend('channel', {
    aircon: 'json',
  })
}