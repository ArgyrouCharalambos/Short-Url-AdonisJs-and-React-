import type { HttpContext } from '@adonisjs/core/http'
import QRCode from 'qrcode'
import { URL } from 'url'
import Url from '#models/url'
import {
  createUrlValidator,
  updateUrlValidator
} from '#validators/url'

export default class ShortUrlsController {
  //vers page d'accueil
  public async index({auth ,response}: HttpContext) {
    const USER = auth.user
    const Utilisateur = await Url.findManyBy('userid', USER?.id)

    return response.json({
      Utilisateur
    })
  }
  //vers page home avec le formulaire
  public async home({ view ,response}: HttpContext) {
    response.ok({message:'Page Home'})
    return view.render('pages/home')
  }

  // création d'une url courte
  public async create({ request, auth,response ,view}: HttpContext) {
    const data = request.all()
    const payload = await createUrlValidator.validate(data)
    const code: number = Number(Math.random().toString().substring(4, 10))
    const appHost = process.env.APP_URL
    const newUrl = new URL(`/${code}`, `${appHost}`)
    const mini: string = String(newUrl)
    const USER = auth.user
    const urls = await Url.create({
      code,
      lien:payload.lien,
      mini,
      userid: USER?.id,
    })
    const Qrlien: string = await QRCode.toDataURL(mini)
    response.created({
      urls,
      Qrlien,
    })
    return view.render('pages/result', {
      Qrlien: [Qrlien],
      newUrl: [newUrl],
      lien: [payload.lien],
    })
  }

  // redirection vers le lien original
  public async redirect({ params, response }: HttpContext) {
    const code: number = params.code
    const Utilisateurs = await Url.findByOrFail('code', code)
    return response.redirect(Utilisateurs.lien)
  }
  // supprimer un lien
  public async delete({ params, response }: HttpContext) {
    const id: number = params.id
    const Utilisateurs = await Url.findOrFail(id)
    await Utilisateurs.delete()

    return response.redirect('/')
  }

  // vers page de modification
  public async edit({ params, view ,response}: HttpContext) {
    const code: number = params.code
    const Utilisateurs = await Url.findByOrFail('code', code)
    const lienOriginal: string = Utilisateurs.lien
    const appHost = process.env.APP_URL

    response.ok({message:"Page de modification",editUsers: [lienOriginal],
      liens: [appHost],
      code: [code]})

    return view.render('pages/edit', {
      editUsers: [lienOriginal],
      liens: [appHost],
      code: [code],
    })
  }
  //enregistrement du formulaire de la modification
  public async editEnregistrement({ params, request, response }: HttpContext) {
    const code: number = params.code
    const Utilisateurs = await Url.findByOrFail('code', code)

    const data = request.all()
    const payload = await updateUrlValidator.validate(data)
    
    const appHost = process.env.APP_URL

    Utilisateurs.code = payload.code
    Utilisateurs.lien = payload.lien
    Utilisateurs.mini = `${appHost}/${payload.code}`
    await Utilisateurs.save()

    response.ok({message: "modification réussi"})

    return response.redirect('/')
  }
  //Pour voir en détail le lien
  public async detail({ params, view,response }: HttpContext) {
    const id: number = params.id
    const Utilisateurs = await Url.findOrFail(id)

    const lien: string = Utilisateurs.lien
    const newUrl: string = Utilisateurs.mini

    const Qrlien: string = await QRCode.toDataURL(lien)

    response.ok({message: "Détail du lien",Qrlien: [Qrlien],
      newUrl: [newUrl],
      lien: [lien],})

    return view.render('pages/result', {
      Qrlien: [Qrlien],
      newUrl: [newUrl],
      lien: [lien],
    })
  }
}
