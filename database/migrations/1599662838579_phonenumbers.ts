import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Phonenumbers extends BaseSchema {
  protected tableName = 'phonenumbers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('phonenumber')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
