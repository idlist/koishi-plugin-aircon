const { Database, Channel } = require('koishi-core')

Channel.extend(() => ({ aircon: {} }))

Database.extend('koishi-plugin-mysql', ({ Domain, tables }) => {
  tables.channel.aircon = new Domain.Json()
})