import type { HttpContext } from '@adonisjs/core/http'
import USER, { UserRole } from '#models/user'
import {
  createUserValidator,
  connexionUserValidator,
} from '#validators/user'

export default class UsersController {
  //création d'un utilisateur
  public async create({ request, response }: HttpContext) {
        const data = request.all()
    const payload = await createUserValidator.validate(data)
    const users = await USER.create({
      fullName:payload.fullName,
      password:payload.password,
      email:payload.email,
      role: UserRole.USER,
    })
    response.created({users})

   return response.redirect('/login') 
     
  }
  //connexion d'un utilisateur
  public async login({ request, auth, response }: HttpContext) {
    const data = request.all()
    const payload = await connexionUserValidator.validate(data)
    const user = await USER.verifyCredentials(payload.email, payload.password)

    await auth.use('web').login(user)
    
    response.json({
      message: 'Connexion réussie',
    })
    
    return response.redirect('/home')
  }

  public async deconnect({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    response.ok({
      message:'Déconnexion réussie'
    })
    
    return response.redirect('/login')
  }
  public async profil({ auth,response ,view}: HttpContext) {
    const user = auth.user
    const fullName = user?.fullName
    const email = user?.email

     response.ok({
      fullName: [fullName],
      email: [email],
    })

    return view.render('pages/profil', {
      fullName: [fullName],
      email: [email],
    })
  }
}
