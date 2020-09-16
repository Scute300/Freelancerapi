import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import Banlist from 'App/Models/Banlist'
import Socialuser from 'App/Models/Socialuser'
import User from 'App/Models/User';
interface token {
  type: string,
  token: string
}
export default class Detectsession {
  public async handle ({request}: HttpContextContract, next: () => Promise<void>,) {
      const tokenheader: string | undefined = request.header('authorization')
      const tokenjson : token | null = tokenheader !== undefined ? JSON.parse(tokenheader) : null
      let user:any = null
      let banverify:any = null
      if(tokenjson !== null){
        const token = await Token.findBy('token', tokenjson.token)
        if(token !== null){
          switch (token.session_type){
            case 'go' || 'fb':
              user = await Socialuser.findBy('social_type', token.session_user_id)
              banverify = await Banlist.findBy('username', token.session_user_id)
              banverify == null ? request.user={status : '200', message:user}  : request.user = {status: '413', message:`You're bannerd for ${banverify.reason}`}
            break
            case 'email':
              user = await User.findBy('username', token.session_user_id)
              banverify = await Banlist.findBy('username', token.session_user_id)
              banverify == null ? request.user={status : '200', message:user} : {status: '413', message:`You're bannerd for ${banverify.reason}`}
            break
          }
        }else {
          request.user = {status: '413', message:`Unautorized`}
        }
      } else {
        request.user = {status: '413', message:`Unautorized`}
      }
      
      
      await next()
  }
}
