import React, { useEffect, useState } from 'react'

const Login = () => {
  const [lettre, setLettre] = useState('')

  useEffect(() => {
    fetch('http://localhost:3333/login') // 👈 Appel vers le backend AdonisJS
      .then((res) => res.json())
      .then((data) => {
        setLettre(data.lettre) // 👈 On extrait juste la valeur
      }) 
      .catch(error => console.error('Erreur:', error))
  }, [])

return (
  
      <div className="bg-blue-500 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-blue-500 text-5xl mb-2">
                <i className="fas fa-link"></i>
              </div>
              <h1 className="text-3xl font-bold text-blue-600">URL Short</h1>
            </div>

            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-6">
              Connectez-vous à votre compte
            </h2>
            <p>{lettre} </p>


            <form className="space-y-5" action="/connexion" method="GET">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="fas fa-envelope"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  required
                  className="w-full pl-5 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="fas fa-lock"></i>
                </div>
                <input
                  type="text"
                  name="password"
                  placeholder="Mot de passe"
                  required
                  className="w-full pl-5 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-eye"></i>
                </button>
              </div>

              <div className="flex items-center">
                <a
                  href="/forgotview"
                  className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="w-full text-black border border-blue hover:bg-blue-600 hover:text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Se connecter
              </button>

              <p className="text-center text-sm text-gray-600">
                <a
                  href="/signin"
                  className="text-blue-500 font-medium hover:text-blue-600 hover:underline"
                >
                  Créer un compte
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Login
