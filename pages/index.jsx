import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/home.module.css'

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
        <div className={styles.right}>

            <h1>Software de autorizaciones medicas</h1>

            <section className={styles.form_group}>
                <label className={styles.cedula}>Servicio</label>
                <input type="text" />
            </section>

            <section className={styles.form_group}>
                <label className={styles.pass} >Contraseña</label>
                <input type="password" />
            </section>

            <button className={styles.login}>Ingresar</button>
            <button className={styles.forgot}>Se me olvido la contraseña</button>

        </div>
    </main>
  )
}
