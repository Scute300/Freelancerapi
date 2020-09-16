import { DateTime } from 'luxon'
import { BaseModel, column , belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Verificationcode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column()
  userId: number

  @column()
  verificationcode : number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
