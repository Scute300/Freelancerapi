// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Banlist from 'App/Models/Banlist'
import Token from 'App/Models/Token'
import Socialuser from 'App/Models/Socialuser'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
    async register({auth, request, response}){
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
                    rules.unique({ table: 'users', column: 'username' })
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
                    rules.unique({ table: 'users', column: 'email' })
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
            user.email = data.email 
            await user.save()

            const token : string = await auth.use('api').attempt(user.email, user.password)

            return response.json({
                status: 'sure',
                data: token
            })


        }catch(error){
            return response.status(400).json({
                status: 'wrong',
                message: error.messages[0]
            })
        }
          
    }

    async Login({auth, request, response}){
        try{
        
            const validation = schema.create({
                password: schema.string({},[
                    rules.required(),
                    rules.minLength(8),
                    rules.maxLength(30)
                ]),
                email: schema.string({},[
                    rules.required(),
                    rules.email(),
                    rules.maxLength(80),
                    rules.exists({ table: 'users', column: 'email' })
                ])
              })
    
              const data = await request.validate({
                 schema: validation,
                 messages: {
                   'password.required': 'Password is wrong',
                   'password.minLength': 'Password is wrong',
                   'password.maxLength': 'Password is wrong',
                   'email.required': 'Please introduce a valid email adress',
                   'email.maxLength': 'Email cannot to be higher at 80 characters',
                   'email.exist': 'Please introduce a valid email adress',
                 }
             })
             const banverify = await Banlist.findBy('email', data.email)

             if (banverify == null) {

                const token : string = await auth.use('api').attempt(data.email, data.password)
   
                return response.json({
                   status:'sure',
                   data: token
                })

            } else {
                return response.status(413).json({
                    status: 'wrong',
                    message : `You're banned for ${banverify.reason}`
                })
            }

        }catch(error){
            return response.status(400).json({
                status : 'wrong',
                message: error.messages[0]
            })
        }
    }

    async me({auth, response}){
        const user = auth.current.user

        const banverify = await Banlist.findBy('email', user.email)

        if (banverify == null) {

            if(auth.current.user.phone == null){
                return response.json({
                    status: 'phone'
                })
            } else {
                return response.json({
                    status: 'sure',
                    data: user
                })
            }
        } else {
            return response.status(413).json({
                status: 'wrong',
                message : `You're banned for ${banverify.reason}`
            })
        }

    }

    async loginbysocial({request, response}: HttpContextContract){
        try{
            console.log('hello world')
            const validation = schema.create({
                name: schema.string({},[
                    rules.required()
                ]),
                username: schema.string({},[
                    rules.required(),
                ]),
                email: schema.string({},[
                    rules.required(),
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' }),
                ]),
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
                 'email.required': 'Please introduce a valid email adress',
                 'email.maxLength': 'Email cannot to be higher at 80 characters',
                 'email.unique': 'Email adress already exist',
                 'email.email' : 'Please introduce a valid Email Adress',
                 'name.required' : 'Name is required',
                 'username.required' : 'Username is required'
               }
           })
           console.log(data)
           const token : string = data.token
           let newtoken = await Token.findBy('username', data.username)
           const registerverify = await Socialuser.findBy('email', data.email)
           if(registerverify !== null){
               if(newtoken !== null){
                    newtoken.username = registerverify.username
                    newtoken.session_type = 'google'
                    newtoken.token = token
                    await newtoken.save()

                    return response.json({
                        status : 'sure',
                    })
               } else {
                   newtoken = await new Token()
                   newtoken.username = registerverify.username
                   newtoken.session_type = 'google'
                   newtoken.token = token
                   await newtoken.save()

                   return response.json({
                       status : 'sure',
                   })
               }
           } else {
               let flag:number = 0
                console.log(flag)
               while(flag < 100){
                    let mat : number = Math.random()* 500
                    let matinteger : number = Math.trunc(mat)
                    const username:string = data.username+matinteger+flag
                    const usercomprobation = {usertable : await User.findBy('username', username), socialtable: await Socialuser.findBy('username', username)}
                    if(usercomprobation.usertable == null && usercomprobation.socialtable == null){
                        const newuser = await new Socialuser()
                        newuser.name = data.name
                        newuser.username = username
                        newuser.social_type = data.type
                        newuser.email = data.email
                        await newuser.save()

                        newtoken = await new Token()
                        newtoken.username = newuser.username
                        newtoken.session_type = 'google'
                        newtoken.token = token
                        await newtoken.save()

                        return response.json({
                            status : 'sure',
                        })
                    }else {
                        flag++
                        console.log('user exist')
                    }
                }
           }
        }catch(error){
            console.log(error)
            return response.status(400).json({
                status: 'wrong',
                data: error.messages[0]
            })

        }
    }
}
