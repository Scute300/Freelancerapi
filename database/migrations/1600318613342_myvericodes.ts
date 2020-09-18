import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Myvericodes extends BaseSchema {
  protected tableName = 'myvericodes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('userId')
      table.integer('verificationcode')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
