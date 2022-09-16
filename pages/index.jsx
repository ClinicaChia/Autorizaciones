import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/home.module.css'

import Form from '../components/Form'


export default function Home() {


  return (
    <main className={styles.container} >
        <div className={styles.left}>
            <Image 
            
            src={'/LOGO.png'}
            width={600}
            height={250}
            
            />
        </div>

        <Form />
        
        

    </main>
  )
}
