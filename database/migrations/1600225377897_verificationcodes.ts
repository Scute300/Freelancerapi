import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Verificationcodes extends BaseSchema {
  protected tableName = 'verificationcodes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('userId').references('id').inTable('users').notNullable
      table.integer('verificationcode').notNullable
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
