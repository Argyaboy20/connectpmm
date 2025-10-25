'use strict'

class SettingController {
  async setting({ view }) {
    return view.render('setting')
  }
}

module.exports = SettingController