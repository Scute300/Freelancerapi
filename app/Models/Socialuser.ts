import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne  } from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'


export default class Socialuser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public social_type : string
  
  @column()
  public social_id : string

  @column()
  public name : string

  @column()
  public username : string
  
  @column()
  public email : string

  @column()
  public isverifiedemail : boolean

  @column()
  public phonenumber : string

  @hasOne(() => Profile, {
    foreignKey : 'user_name'
  })
  public profile: HasOne<typeof Profile>

}
