import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Banlists extends BaseSchema {
  protected tableName = 'banlists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email')
      table.string('username')
      table.string('reason')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
