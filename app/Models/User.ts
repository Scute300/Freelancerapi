import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Profile from 'App/Models/Profile'
import Phonenumber from './Phonenumber'

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

  @column()
  public email : string

  @column()
  public password : string
  
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.hash(user.password)
    }
  }
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasOne(() => Phonenumber)
  public phonenumber: HasOne<typeof Profile>
  
}
