// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Token from 'App/Models/Token'
import Socialuser from 'App/Models/Socialuser'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Banlist from 'App/Models/Banlist'
import Verificationcode from 'App/Models/Verificationcode'
import Mail from '@ioc:Adonis/Addons/Mail'

  
interface user {
    response : boolean,
    email:string,
    name:string,
    username:string,
    token:string,
    id:string
}

export default class UsersController {
    async registerbyemail({auth, request, response}){
        try{
        
            const validation = schema.create({
                name: schema.string({},[
                    rules.alpha({
                        allow : ['space']
                    }),
                    rules.minLength(5),
                    rules.maxLength(20),
                    rules.required()
                ]),
                username: schema.string({},[
                    rules.alpha({
                        allow:['dash', 'underscore']
                    }),
                    rules.minLength(5),
                    rules.maxLength(20),
                    rules.required(),
                    rules.unique({ table: 'users', column: 'username' }),
                    rules.unique({ table: 'socialusers', column: 'username' })
                ]),
                password: schema.string({},[
                    rules.required(),
                    rules.minLength(8),
                    rules.maxLength(30)
                ]),
                email: schema.string({},[
                    rules.required(),
                    rules.email(),
                    rules.maxLength(80),
                    rules.unique({ table: 'users', column: 'email' }),
                    rules.unique({ table: 'socialusers', column: 'email' })
                ]),
              })
    
             const data = await request.validate({
                schema: validation,
                messages: {
                  'name.required': 'Name is required to sign up',
                  'name.alpha': 'Name cant contain special characters',
                  'name.minLength': 'Name needs to be higher at 8 characters',
                  'name.maxLength': 'Name cannot to be less at 20 characters',
                  'username.required': 'Username is required to sign up',
                  'username.alpha': 'Username cant contain special characters',
                  'username.minLength': 'Username needs to be higher at 8 characters',
                  'username.maxLength': 'Username cannot to be less at 20 characters',
                  'username.unique': 'This username is already in use',
                  'password.required': 'Password is required to sign up',
                  'password.minLength': 'Username needs to be higher at 8 characters',
                  'password.maxLength': 'Username cannot to be higher at 30 characters',
                  'email.required': 'Email is required to sign up',
                  'email.maxLength': 'Email cannot to be less at 80 characters',
                  'email.unique': 'This Email is already in use',
    
                }
            })

            const user = new User()
            user.name = data.name 
            user.username = data.username
            user.password = data.password 
            user.isverifiedemail = false
            user.email = data.email 
            await user.save()

            const token : string = await auth.use('api').attempt(user.email, user.password)
            const savetoken = await new Token()
            savetoken.session_user_id = user.username
            savetoken.session_type = 'email'
            savetoken.token = token
            await savetoken.save() 
            
            const verificationcode :number = Math.random() * (1000 - 9999) + 1000
            
            const newcode = new Verificationcode()
            newcode.userId = user.id
            newcode.verificationcode = verificationcode
            await newcode.save()

            await Mail.send((message)=>{
                message
                .from('info@example.com')
                .to('virk@adonisjs.com')
                .subject('Welcome Onboard!')
                .htmlView('emails/index', {
                    user: {fullName: user.username},
                    code: newcode.verificationcode
                })
            })

            return response.json({
                status: 'email',
                data: token,
                user: user
            })


        }catch(error){
            return response.status(400).json({
                status: 'wrong',
                message: error.messages[0]
            })
        }
          
    }

    async loginbysocial({request, response}: HttpContextContract){
        try{
            const validation = schema.create({
                token: schema.string({},[
                    rules.required()
                ]),
                type: schema.string({},[
                    rules.required(),
                    rules.alpha()
                ])
            })
    
            const data = await request.validate({
               schema: validation,
               messages: {
                 'token.required': 'Please introduce a valid email adress',
                 'type.required' : 'Username is required'
               }
           })

           let usuario : user = {response : false, email:'', name: '', username: '', token: '', id: ''}
           
           switch(data.type){
               case 'go':
                await axios.get('https://www.googleapis.com/userinfo/v2/me', {
                  headers: { Authorization: `Bearer ${data.token}` },
                }).then(response =>{
                  usuario = {response : true, email:response.data.email != null ? response.data.email : 'Not email adress', 
                    name: response.data.name, username: response.data.given_name, token : data.token, id:response.data.id}
                console.log(response)
                })
                break;
               case 'fb':
                await axios.get(`https://graph.facebook.com/me?access_token=${data.token}`)
                .then(response =>{
                  usuario = {response : true, email: response.data.email != null ? response.data.email : 'Not email adress',
                  name: response.data.name, username: response.data.name, token : data.token, id:response.data.id}
                console.log(response)
                })
               break;
           }

           const token : string = data.token
           let newtoken = await Token.findBy('session_user_id', data.type+usuario.id)
           const registerverify = await Socialuser.findBy('social_type', data.type+usuario.id)
           if(registerverify !== null && usuario.response == true){
            const banverify = await Banlist.findBy('social_type', data.type+usuario.id)
            if(banverify == null){
                if(newtoken !== null){
                     newtoken.session_user_id = data.type+usuario.id
                     newtoken.session_type = data.type
                     newtoken.token = token
                     await newtoken.save()
 
                     return response.json({
                         status : 'sure',
                         token: newtoken.token,
                         user: registerverify
                     })
                } else {
                    newtoken = await new Token()
                    newtoken.session_user_id = data.type+usuario.id
                    newtoken.session_type = data.type
                    newtoken.token = token
                    await newtoken.save()
 
                    return response.json({
                        status : 'sure',
                        token: newtoken.token,
                        user: registerverify
                    })
                }
            } else {
                return response.status(413).json({
                    status : 'ban',
                    message : `You're Banned for ${banverify.reason}`
                })
            }
           } else {
               switch(usuario.response){
                   case true:
                    const user = await new Socialuser()
                    user.name = usuario.name
                    user.username = data.type+usuario.id
                    user.social_type = data.type+usuario.id
                    user.isverifiedemail = true
                    await user.save()

                    newtoken = await new Token()
                    newtoken.session_user_id = data.type+usuario.id
                    newtoken.session_type = data.type
                    newtoken.token = token
                    await newtoken.save()
                    
                    return response.json({
                        status : 'sure',
                        token : newtoken.token,
                        user : user
                    })

                  case false:{
                    return response.status(413).json({
                        status : 'wrong',
                        message: 'Token unautorized'
                    })
                  }
                }
           }
        }catch(error){
            return response.status(400).json({
                status: 'wrong',
                data: error.messages[0]
            })

        }
    }

    async me({request, response}){
        if(request.user.status !== '413'){
            switch(request.user.message.isverifiedemail){
                case true :
                    return response.json({
                        status: 'sure',
                        data : request.user.message
                    })
                break
                case false:
                    return response.status(413).json({
                        status: 'email',
                        message : 'Please, verify your emal adress for to continue'
                    })
                break
            }
        } else {
            return response.status('413').json({
                status:'Unautorized',
                message: request.user.message
            })
        }
    }

    async verifyemail({request, response}){
        if(request.user.status !== '413'){
            try{
                const validation = schema.create({
                    code: schema.number([
                        rules.required(),
                        rules.range(1000, 9999)
                    ])
                })
        
                const data = await request.validate({
                   schema: validation,
                   messages: {
                     'code.required': 'Introduce a valid verification code',
                     'code.range' : 'Introduce a valid verification code'
                   }
               })

               const code = await Verificationcode.findBy('userId', request.user.message.id)

               const verify = code?.verificationcode == data.code ? true : false
               switch (verify){
                   case true:
                       const user = await User.findBy('id', request.user.message.id)
                       if (user !== null){
                            user.isverifiedemail  = true
                            await user.save()
                        }
                        return response.json({
                            data:true,
                            message: 'Your email has be verified'
                        })
                    break
                    case false :
                        return response.status('413').json({
                            status:'Unautorized',
                            message: 'Code wrong'
                        })
               }

            } catch (error){
                return response.status('400').json({
                    status:'Unautorized',
                    message: error.message[0]
                })
            }
             
        } else {
            return response.status('413').json({
                status:'Unautorized',
                message: request.user.message
            })
        }
    }
}
