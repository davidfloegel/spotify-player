const actualURL = 'https://spotify-listening-party.vercel.app/'
export const APP_URL = process.env.VERCEL_URL
    ? actualURL
    : 'http://localhost:3000'
