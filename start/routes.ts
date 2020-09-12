/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Socialuser from 'App/Models/Socialuser'
Route.get('/', async () => {
  const x= await Socialuser.all()
  return x;
})
Route.group(()=>{
  Route.post('/newuser', 'UsersController.register')
  Route.post('/loginbysocial', 'UsersController.loginbysocial')
  Route.get('/me', 'UserController.me')
}).prefix('/api/v1')

Route.group(()=>{
  Route.get('/me', 'UserController.me')
}).prefix('/api/v2').middleware('auth')