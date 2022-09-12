import React from 'react'
import Image from 'next/image'
import styles from '../styles/navbar.module.css'
import { useRouter } from 'next/router'
export default function Navbar({active}) {

  const router = useRouter()
  return (
    <nav className={styles.container}>

        <ul className={styles.opciones}>
            <li className={`${styles.item} ${ active && styles.active}`}
            onClick={() => router.push('/main')}
            >Formulario</li>

            <li 
            onClick={() => router.push('/summary')}
            className={`${styles.item} ${ !active && styles.active}`}>Resumen</li>

            <li 
            onClick={() => router.push('/usuarios')}
            className={`${styles.item}`}>Usuarios</li>

            <li 
            onClick={() => router.push('/nuevo')}
            className={`${styles.item}`}>Nuevo</li>
        </ul>

        <Image 
            src={'/LOGO.png'}
            width={220}
            height={80}
            style={{paddingRight: '40px'}}
        />
    </nav>
  )
}
