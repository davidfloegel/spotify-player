import { redirect } from 'next/navigation'

import fetch from 'node-fetch'
import request from 'request'
import { APP_URL } from '../../config'

const spotifyClientId = 'dcc6e4f5c0c042deb35dd4d11d834bae'
const spotifySecret = '87617bc959344652aa53ac8beba81aad'

export async function GET(req, res) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    var authOptions = {
        body: new URLSearchParams({
            code: code,
            redirect_uri: `${APP_URL}/localhost:3000/auth/callback`,
            grant_type: 'authorization_code',
        }),
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(spotifyClientId + ':' + spotifySecret).toString(
                    'base64'
                ),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        ...authOptions,
    })

    const body = await response.json()
    redirect('/?code=' + body.access_token)

    // request.post(authOptions, function(error, response, body) {
    //   console.log('>>', error)
    //
    //   if (!error && response.statusCode === 200) {
    //     var access_token = body.access_token;
    //     redirect('/')
    //   }
    // });
}
