'use strict'

class SignInController {
    async signin({ view }) {
        return view.render('signin')
    }

    /* Handle signin form submission - simplified without auth */
    async store({ request, response, session }) {
        try {
            // Get form data
            const { userType, nim, nidn, password } = request.all()
            
            // Validate required fields
            if (!userType || !password) {
                session.flash({
                    error: 'User type dan password wajib diisi'
                })
                return response.redirect('back')
            }

            // Basic validation based on user type
            let identifier = null
            let isValid = true

            switch (userType) {
                case 'peserta':
                    if (!nim) {
                        session.flash({
                            error: 'NIM wajib diisi untuk peserta'
                        })
                        return response.redirect('back')
                    }
                    identifier = nim
                    break

                case 'koordinator':
                    if (!nidn) {
                        session.flash({
                            error: 'NIDN wajib diisi untuk koordinator'
                        })
                        return response.redirect('back')
                    }
                    identifier = nidn
                    break

                case 'umum':
                    identifier = 'umum_user'
                    break

                default:
                    session.flash({
                        error: 'Tipe user tidak valid'
                    })
                    return response.redirect('back')
            }

            // For now, just accept any credentials and redirect to home
            // TODO: Implement proper authentication when database is ready
            
            // Set success message
            session.flash({
                success: 'Login berhasil! Selamat datang.'
            })

            // Redirect to beranda
            return response.redirect('/home')

        } catch (error) {
            console.error('SignIn Error:', error)
            
            session.flash({
                error: 'Terjadi kesalahan saat login. Silakan coba lagi.'
            })
            
            return response.redirect('back')
        }
    }

    /**
     * Handle logout - simplified
     */
    async logout({ response, session }) {
        try {
            session.flash({
                success: 'Anda berhasil logout'
            })
            
            return response.redirect('/auth/signin')
            
        } catch (error) {
            console.error('Logout Error:', error)
            
            session.flash({
                error: 'Terjadi kesalahan saat logout'
            })
            
            return response.redirect('back')
        }
    }

    /**
     * Check if user is authenticated (API endpoint)
     * Returns mock data for now
     */
    async checkAuth({ response }) {
        try {
            // Return mock user data
            return response.json({
                success: true,
                authenticated: true,
                user: {
                    id: 1,
                    nama: 'User Demo',
                    user_type: 'peserta',
                    nim: '12345678',
                    nidn: null
                }
            })
            
        } catch (error) {
            return response.json({
                success: false,
                authenticated: false,
                message: 'User not authenticated'
            })
        }
    }

    /**
     * Validate signin credentials (AJAX endpoint)
     * Simplified version without database check
     */
    async validateCredentials({ request, response }) {
        try {
            const { userType, nim, nidn, password } = request.all()
            
            // Basic validation
            const errors = {}
            
            if (!userType) {
                errors.userType = 'User type wajib dipilih'
            }
            
            if (!password) {
                errors.password = 'Password wajib diisi'
            } else if (password.length < 6) {
                errors.password = 'Password minimal 6 karakter'
            }
            
            // Type-specific validation
            switch (userType) {
                case 'peserta':
                    if (!nim) {
                        errors.nim = 'NIM wajib diisi'
                    } else if (!/^\d{8,}$/.test(nim)) {
                        errors.nim = 'NIM harus berupa angka minimal 8 digit'
                    }
                    break
                    
                case 'koordinator':
                    if (!nidn) {
                        errors.nidn = 'NIDN wajib diisi'
                    } else if (!/^\d{10,}$/.test(nidn)) {
                        errors.nidn = 'NIDN harus berupa angka minimal 10 digit'
                    }
                    break
            }
            
            if (Object.keys(errors).length > 0) {
                return response.json({
                    success: false,
                    errors
                })
            }
            
            // For now, accept all valid format credentials
            // TODO: Check against database when ready
            
            return response.json({
                success: true,
                message: 'Kredensial valid'
            })
            
        } catch (error) {
            console.error('Credential validation error:', error)
            
            return response.json({
                success: false,
                errors: {
                    general: 'Terjadi kesalahan saat validasi'
                }
            })
        }
    }

    /**
     * Get user profile data
     * Returns mock data for now
     */
    async profile({ response }) {
        try {
            // Return mock user data
            return response.json({
                success: true,
                user: {
                    id: 1,
                    nama: 'User Demo',
                    user_type: 'peserta',
                    nim: '12345678',
                    nidn: null,
                    pt_pengirim: 'Universitas Demo',
                    pt_penerima: null,
                    pt_koordinator: null,
                    status_koordinator: null,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            })
            
        } catch (error) {
            return response.json({
                success: false,
                message: 'Error getting profile'
            }, 500)
        }
    }
}

module.exports = SignInController