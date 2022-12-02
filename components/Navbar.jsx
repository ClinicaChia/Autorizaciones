import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function Navbar({active}) {



  const router = useRouter()
  return (
    <nav className="w-full bg-blue-800 flex justify-between items-center p-2 ">

        <ul className="flex gap-4 text-white text-xl pl-10 ">
            <li className={active === 1  ? 'font-bold cursor-pointer' : 'cursor-pointer'}
            onClick={() => router.push('/main')}
            >Formulario</li>

            <li 
            onClick={() => router.push('/summary')}
            className={ active === 2  ? 'font-bold cursor-pointer' : 'cursor-pointer'}>Resumen</li>

<li 
            onClick={() => router.push('/search')}
            className={ active === 3  ? 'font-bold cursor-pointer' : 'cursor-pointer'}>Busqueda</li>

        </ul>
        
        <div className="pr-4">
            <Image 
                src={'/LOGO.png'}
                width={200}
                height={80}
            />
        </div>
        
    </nav>
  )
}
