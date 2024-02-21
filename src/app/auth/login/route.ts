import { redirect } from 'next/navigation'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const spotifyClientId = 'dcc6e4f5c0c042deb35dd4d11d834bae'

export async function GET(req, res) {
  
  var scope = "streaming \
               user-top-read \
               user-read-currently-playing \
               user-read-playback-state \
               user-read-email \
               user-read-private"

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotifyClientId,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state
  })


  redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())

}
