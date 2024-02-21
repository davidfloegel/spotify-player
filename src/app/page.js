'use client'
import Image from 'next/image'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { Login } from './login'
import { useSearchParams } from 'next/navigation'
import { Player } from './player'

const Page = () => {
    const searchParams = useSearchParams()
    const [token, setToken] = useState('')

    useEffect(() => {
        const getToken = async () => {
            setToken(searchParams.get('code'))
        }

        getToken()
    }, [searchParams.get('code')])

    if (!token) {
        return <Login />
    }

    return <Player token={token} />
}

export default function Home() {
    return (
        <Suspense fallback="Loading...">
            <Page />
        </Suspense>
    )
}
