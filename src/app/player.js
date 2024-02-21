'use client'
import { useEffect, useRef, useState } from 'react'
const {
    format,
    differenceInMilliseconds,
    addMilliseconds,
} = require('date-fns')

const defaultTrack = {
    name: '',
    album: {
        images: [{ url: '' }],
    },
    artists: [{ name: '' }],
}

const trackId = '5LLHkwl2JjOk3cEh1Pg8A3'

const startdate = new Date()
startdate.setUTCHours(12)
startdate.setUTCMinutes(0), startdate.setUTCSeconds(0)
startdate.setUTCMilliseconds(0)
const LISTENING_PARTY_START_DATE = startdate

function calculateOffset(startDate, currentDateTime, songDuration) {
    // Calculate the time difference in milliseconds
    const timeDifference = differenceInMilliseconds(currentDateTime, startDate)

    // Calculate the offset considering the song duration
    const offset = timeDifference % songDuration

    // Calculate the adjusted start date based on the offset
    const adjustedStartDate = addMilliseconds(startDate, -offset)

    return {
        offset: offset,
        adjustedStartDate: adjustedStartDate,
    }
}

export const Player = ({ token }) => {
    const deviceIdR = useRef()
    const [player, setPlayer] = useState()

    const [currentTrack, setCurrentTrack] = useState({
        loading: false,
        error: null,
        track: null,
    })

    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const getTrackInfo = async () => {
            try {
                setCurrentTrack((t) => ({ ...t, loading: true }))

                const res = await fetch(
                    `https://api.spotify.com/v1/tracks/${trackId}`,
                    {
                        method: 'GET',

                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await res.json()

                setCurrentTrack((t) => ({ ...t, loading: false, track: data }))
            } catch (e) {
                setCurrentTrack((t) => ({ ...t, loading: false, error: true }))
            }
        }

        getTrackInfo()
    }, [])

    const updateCurrentTime = () => {
        setInterval(() => {
            setCurrentTime((t) => t + 1000)
        }, 1000)
    }

    const onPlay = async () => {
        if (!currentTrack.track) {
            alert('no track loaded')
            return
        }

        const offset = calculateOffset(
            LISTENING_PARTY_START_DATE,
            new Date(),
            currentTrack.track.duration_ms
        )

        try {
            return fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceIdR.current}`,
                {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    redirect: 'follow',
                    referrer: 'no-referrer',
                    body: JSON.stringify({
                        uris: [`spotify:track:${trackId}`],
                        position_ms: offset?.offset || 0,
                    }),
                }
            ).then(() => {
                setCurrentTime(offset?.offset || 0)
                updateCurrentTime()
                setIsPlaying(true)
            })
        } catch (e) {
            // nothing
        }
    }

    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Medallion Community',
                getOAuthToken: (cb) => {
                    cb(token)
                },
                volume: 0.5,
            })

            setPlayer(player)

            player.addListener('initialization_error', (e) =>
                setCurrentTrack((t) => ({ ...t, error: true }))
            )

            player.addListener('ready', ({ device_id }) => {
                deviceIdR.current = device_id
            })

            player.addListener('not_ready', ({ device_id }) => {
                deviceIdR.current = device_id
            })

            // TODO
            // When user pauses and resumes, it needs to jump to right timestamp
            // When user tries and scrubs in the spotify app, jump back to right position
            player.addListener('player_state_changed', async (state) => {
                if (!state) {
                    return
                }

                if (state?.track_window?.current_track?.id !== trackId) {
                    onPlay()
                }

                // const position = state.position
                //
                // if (Math.abs(position - currentTime) > 5000) {
                //     console.log('user has scrubbed', currentTime)
                //     onPlay(currentTime)
                // }
            })

            player.connect()
        }
    }, [currentTime])

    if (!player) {
        return (
            <div className="container">
                <b>Player not ready :(</b>
            </div>
        )
    }

    if (currentTrack.error) {
        return (
            <div className="container">
                <b>Could not load the listening party!</b>
            </div>
        )
    }

    if (currentTrack.loading || !currentTrack.track) {
        return (
            <div className="container">
                <b>Loading the listening party...</b>
            </div>
        )
    }

    const { track } = currentTrack

    return (
        <div className="container">
            <h1>Welcome to the Listening Party!</h1>

            <h3>
                This listening party started at{' '}
                {format(LISTENING_PARTY_START_DATE, 'HH:mm')}
            </h3>

            <div className="coverContainer">
                <img src={track.album.images[0].url} className="coverImg" />

                {!isPlaying ? (
                    <div className="joinNowOverlay">
                        <button className="joinNowBtn" onClick={() => onPlay()}>
                            Listen now
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="trackInfo">
                {track.artists.map((artist) => artist.name).join(', ')} -{' '}
                {track.name}
            </div>

            {isPlaying ? (
                <div className="progressbar">
                    <div
                        className="progressindicator"
                        style={{
                            width: `${(currentTime / track.duration_ms) * 100}%`,
                        }}
                    />
                </div>
            ) : null}
        </div>
    )
}
