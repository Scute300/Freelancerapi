import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Socialusers extends BaseSchema {
  protected tableName = 'socialusers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('social_type')
      table.string('name')
      table.string('username')
      table.string('email')
      table.boolean('isverifiedemail').notNullable()
      table.string('phonenumber', 60)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
