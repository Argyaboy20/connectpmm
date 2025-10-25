'use strict'

class SignUpController {
    async signup({ view }) {
        return view.render('signup')
    }

    async store({ request, response, session }) {
        try {
            const data = request.all()
            console.log('Signup data received:', JSON.stringify(data, null, 2))
            
            // Validasi dasar
            if (!data.userType || !data.nama || !data.password) {
                console.log('Basic validation failed')
                session.flash({ error: 'Semua field wajib diisi' })
                return response.redirect('back')
            }

            // Buat user baru
            const user = new User()
            user.nama = data.nama
            user.password = data.password
            user.user_type = data.userType
            user.email = `${Date.now()}@${data.userType}.pmmconnect.com`
            
            // Set field khusus berdasarkan userType
            if (data.userType === 'peserta') {
                if (!data.nim) {
                    session.flash({ error: 'NIM wajib diisi untuk peserta' })
                    return response.redirect('back')
                }
                user.nim = data.nim
                user.pt_pengirim = data.ptPengirimCustom || data.ptPengirim || 'PT Default'
                user.pt_penerima = data.ptPenerimaCustom || data.ptPenerima || 'PT Default'
            } else if (data.userType === 'koordinator') {
                if (!data.nidn) {
                    session.flash({ error: 'NIDN wajib diisi untuk koordinator' })
                    return response.redirect('back')
                }
                user.nidn = data.nidn
                user.pt_koordinator = data.ptKoordinatorCustom || data.ptKoordinator || 'PT Default'
                user.status_koordinator = data.statusKoordinator || 'pengirim'
            }

            console.log('Attempting to save user:', user.toJSON())
            await user.save()
            console.log('User saved successfully with ID:', user.id)

            session.flash({ success: 'Pendaftaran berhasil! Semoga betah yaa ^^' })
            return response.redirect('/home')
            
        } catch (error) {
            console.error('Signup error:', error)
            console.error('Error stack:', error.stack)
            
            if (error.code === 'ER_DUP_ENTRY') {
                session.flash({ error: 'Data sudah terdaftar, gunakan data lain' })
            } else {
                session.flash({ error: 'Terjadi kesalahan: ' + error.message })
            }
            
            return response.redirect('back')
        }
    }
}

module.exports = SignUpController