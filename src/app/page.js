'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { Login } from "./login";
import { useSearchParams } from "next/navigation";
import { Player } from "./player";

export default function Home() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const getToken = async () => {
      setToken(searchParams.get('code'))
    }

    getToken();
  }, [searchParams.get('code')])

  if (!token) {
return <Login />
  }
    
  return (
    <Player token={token} />
  )
}
