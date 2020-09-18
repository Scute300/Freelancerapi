import { DateTime } from 'luxon'
import { BaseModel, column , BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
export default class Myvericode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @column()
  public verificationcode : number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
