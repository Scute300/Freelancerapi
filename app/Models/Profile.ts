import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Socialuser from 'App/Models/Socialuser'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId : number

  @column()
  public avatar : string

  @column()
  public avatarpublicid : string

  @column()
  public bio : string

  @column()
    public phonenumber : string
  
  @column()
  public birthday : string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Socialuser)
  public socialuser: BelongsTo<typeof Socialuser>

}
