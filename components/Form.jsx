import React, {useState} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../styles/home.module.css'

export default function Form() {
    const router = useRouter();

    const [data, setData] = useState({
        servicio: '',
        pass: '',
        rango: '',
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const HandleLogIn = (e) => {
        e.preventDefault();
        axios.post('/api/login', data)
        .then((res) => {
            const data = res.data;

            localStorage.setItem('data',  JSON.stringify(data) )
         
            data.Cargo === 'Asistencial' ? router.push('/main') : router.push('/summary')
        
        })
        .catch((err) => {alert("Contraseña Incorrecta")})
        
    }
  return (
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
                <label className={styles.cedula}>Cargo</label>
                <article className={styles.radio_form} >
                    <input type="radio" name="rango" id='r1' value="Asistencial" onChange={handleChange}  />
                    <label htmlFor="r1">Asistencial</label>
                </article>

                <article className={styles.radio_form} >
                    <input type="radio" id='r2' name="rango" value="Facturador" onChange={handleChange}  />
                    <label htmlFor="r2">Facturador</label>
                </article>
                
            </section>

            <section className={styles.form_group}>
                <label className={styles.pass}  >Contraseña</label>
                <input type="password" value={data["pass"]} name="pass" onChange={handleChange} />
            </section>

            <button className={styles.login} onClick={HandleLogIn} >Ingresar</button>
            <button className={styles.forgot}  onClick={()=>{ window.open('http://173.16.10.137/glpi/plugins/formcreator/front/formdisplay.php?id=1', '_blank'); }} >Se me olvido la contraseña</button>

        </div>
  )
}
