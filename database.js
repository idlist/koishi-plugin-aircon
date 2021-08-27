const { Database, Channel } = require('koishi')

Channel.extend(() => ({ aircon: {} }))

Database.extend('koishi-plugin-mysql', ({ Domain, tables }) => {
  tables.channel.aircon = new Domain.Json()
})