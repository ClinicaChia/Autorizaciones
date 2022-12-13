import React,{useEffect,useState} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
export default function Navbar({active}) {

  const [perfil,setPerfil] = useState("")

 useEffect(() => {
  //get localstorage convert to json and set perfil
  const perfil = JSON.parse(localStorage.getItem('data'))

  console.log(perfil)
  setPerfil(perfil.servicio)
 }, [])




  const router = useRouter()
  return (
    <nav className="w-full bg-blue-800 flex justify-between items-center p-2 ">

        <ul className="flex gap-4 text-white text-xl pl-10 ">


            { perfil!== "Observador" && <li className={active === 1  ? 'font-bold cursor-pointer' : 'cursor-pointer'}
            onClick={() => router.push('/main')}
            >Formulario</li>}

            <li 
            onClick={() => router.push('/summary')}
            className={ active === 2  ? 'font-bold cursor-pointer' : 'cursor-pointer'}>Resumen</li>

            { perfil!== "Observador" && perfil=== "Administrador" && <li 
            onClick={() => router.push('/search')}
            className={ active === 3  ? 'font-bold cursor-pointer' : 'cursor-pointer'}>Busqueda</li>}

            { perfil!== "Observador" && perfil=== "Administrador" && <li 
            onClick={() => router.push('/reports')}
            className={ active === 4  ? 'font-bold cursor-pointer' : 'cursor-pointer'}>Reportes</li>}

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
