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
  social_type : string
  
  @column()
  social_id : string

  @column()
  name : string

  @column()
  username : string

  @column()
  email : string

  @hasOne(() => Profile, {
    foreignKey : 'user_name'
  })
  public profile: HasOne<typeof Profile>

}
