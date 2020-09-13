import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Banlist from 'App/Models/Banlist'
import Socialuser from 'App/Models/Socialuser'
import User from 'App/Models/User';

export default class Detectsession {
  public async handle ({request, response}: HttpContextContract, next: () => Promise<void>) {
    try {
      const validation = schema.create({
        token : schema.string({},[
          rules.required()
        ])
      })

      const data = await request.validate({
        schema:validation
      })
      const tokenjson = await JSON.parse(data.token)
      const token = await Token.findBy('token', tokenjson.token)
      if (token !== null) {
        const banverify = await Banlist.findBy('username', token.username)
        let user : any = null 
        if (banverify == null){
          if(tokenjson.type == 'google' ||  tokenjson.type == 'facebook'){
            user = await Socialuser.findBy('username', token.username)
            return user
          } else if(tokenjson.type == 'email'){
            user = await User.findBy('username', token.username)
            return user
          }
        } else {
          return response.status(413).json({
            status : 'banned',
            message : `You're banned for ${banverify.reason}`
          })
        }
      } else{
        return response.status(413).json({
          status: 'wrong',
          message: 'unautorized'
        })
      }
      await next()
    } catch(error){
      return response.status(413).json({
        status: 'wrong',
        message: 'unautorized'
      })
    }
  }
}
