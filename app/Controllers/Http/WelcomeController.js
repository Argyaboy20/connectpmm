'use strict'

class WelcomeController {
  /**
   * Render the welcome/landing page
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async welcome({ view, response }) {
    try {
      // You can pass data to the view if needed
      const pageData = {
        title: 'PMM Connect - Share Your Story',
        description: 'Connect, create, and share through photos and conex. Join millions of users expressing themselves on PMM Connect.',
        features: [
          {
            icon: '📷',
            title: 'Share Photos',
            description: 'Upload and share your favorite moments with beautiful photo galleries.'
          },
          {
            icon: '💭',
            title: 'Express with Conex',
            description: 'Share your thoughts, ideas, and stories through conex - our unique way of micro-blogging.'
          },
          {
            icon: '🌐',
            title: 'Connect & Discover',
            description: 'Find like-minded people, follow interesting accounts, and build meaningful connections.'
          }
        ]
      }

      return view.render('welcome', pageData)
    } catch (error) {
      console.error('Error rendering welcome page:', error)
      return response.status(500).json({
        error: 'Internal server error'
      })
    }
  }

  /**
   * Handle signup redirect
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async signup({ response }) {
    // Redirect to signup page or render signup form
    return response.redirect('/signup')
  }

  /**
   * Handle signin redirect
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async signin({ response }) {
    // Redirect to signin page or render signin form
    return response.redirect('/signin')
  }
}

module.exports = WelcomeController