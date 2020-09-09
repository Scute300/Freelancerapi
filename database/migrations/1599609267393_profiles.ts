import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('userId').references('id').inTable('user').onDelete('CASCADE')
      table.string('avatar')
      table.string('avatarpublicid')
      table.string('bio')
      table.string('location')
      table.string('birthday', 15)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
