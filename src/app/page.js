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
        return (
            <Suspense>
                <Login />
            </Suspense>
        )
    }

    return (
        <Suspense>
            <Player token={token} />
        </Suspense>
    )
}

export default function Home() {
    return (
        <Suspense>
            <Page />
        </Suspense>
    )
}
