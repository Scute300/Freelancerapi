import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Profile from 'App/Models/Profile'
import Myvericode from 'App/Models/Myvericode'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name : string
  
  @column()
  public username : string
  
  @column({ serializeAs: null })
  public password : string

  @column()
  public phonenumber:string

  @column()
  public email : string
  
  @column()
  public isverifiedemail : boolean

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasOne(() => Myvericode, {
    foreignKey: 'user_name',
  })
  public vericode: HasOne<typeof Myvericode>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

}
