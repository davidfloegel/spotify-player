import { redirect } from 'next/navigation'

import fetch from 'node-fetch';
import request from 'request'

const spotifyClientId = 'dcc6e4f5c0c042deb35dd4d11d834bae'
const spotifySecret = '87617bc959344652aa53ac8beba81aad'

export async function GET(req, res) {
  var authOptions = {
    body: new URLSearchParams({
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: 'authorization_code'
    }),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotifyClientId+ ':' + spotifySecret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
  };

  const response = await fetch('https://accounts.spotify.com/api/token', {
  method: 'post',
  ...authOptions,
  })

  console.log('>>>', response)

  return new Response(JSON.stringify(response))

  // request.post(authOptions, function(error, response, body) {
  //   console.log('>>', error)
  //
  //   if (!error && response.statusCode === 200) {
  //     var access_token = body.access_token;
  //     redirect('/')
  //   }
  // });

}


