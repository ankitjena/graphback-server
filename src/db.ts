import knex from 'knex'

export async function connect(options: knex.MySqlConnectionConfig | knex.Sqlite3ConnectionConfig) {
  return knex({
    client: 'sqlite3',
    connection: options,
    useNullAsDefault: true
  })
}
