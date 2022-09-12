import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/home.module.css'
import { useState } from 'react'
export default function Home() {

    const [data, setData] = useState({
        servicio: '',
        pass: '',
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

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
                <select className={styles.services} name="servicio"  value={data["servicio"]}  onChange={handleChange} >
                    <option value=" "></option>
                    <option value="Hospitalizacion">Hospitalizacion</option>
                    <option value="Urgencias">Urgencias</option>
                    <option value="UCI neonatal">UCI neonatal</option>
                    <option value="1UCI adulto">UCI adulto</option>
                    <option value="Cirugia">Cirugia</option>
                    <option value="Ginecobtetricia">Ginecoobtetricia</option>

                
                </select>
            </section>

            <section className={styles.form_group}>
                <label className={styles.pass} value={data["pass"]} onChange={handleChange} >Contraseña</label>
                <input type="password" />
            </section>

            <button className={styles.login}>Ingresar</button>
            <button className={styles.forgot}>Se me olvido la contraseña</button>

        </div>
    </main>
  )
}
