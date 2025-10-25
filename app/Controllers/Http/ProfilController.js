'use strict'

class ProfilController {
  async profil({ view }) {
    return view.render('profil')
  }
}

module.exports = ProfilController