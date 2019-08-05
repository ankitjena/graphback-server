import knex from 'knex'

/**
 * config class
 */
class Config {
  public port: any
  public db: knex.MySqlConnectionConfig
  constructor() {
    this.port = process.env.PORT || 4000
    this.db = require('../../config.json').dbConfig
  }
}

export default new Config()
