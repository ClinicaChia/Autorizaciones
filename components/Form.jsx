import React, {useState} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'


export default function Form() {
    const router = useRouter();

    const [data, setData] = useState({
        servicio: '',
        pass: '',
        rango: '',
        usuario: '',
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const HandleLogIn = (e) => {
        e.preventDefault();
        const tempData = data
        const rango = data.servicio ==="Autorizador" ? "Facturador" : "Asistencial"
        tempData.rango = rango
        if(data.servicio === "Autorizador" && data.usuario === ""){

            return alert("Ingrese su usuario")

        }
        axios.post('/api/login', tempData)
        .then((res) => {
            const data = res.data;

            localStorage.setItem('data',  JSON.stringify(tempData) )
         
            data.Cargo === 'Asistencial' ? router.push('/main') : router.push('/summary')
        
        })
        .catch((err) => {alert("Contraseña Incorrecta")})
        
    }
  return (
    <div className="flex  w-1/2  h-screen items-center ">

        <div  className="flex h-3/4 justify-evenly w-full flex-col items-center" >

            <h1 className='text-3xl font-semibold text-blue-800' >Software de autorizaciones medicas</h1>

            <section className="flex w-2/5 flex-col">
                <label className="text-lg font-semibold border-blue-800 rounded-md outline-none">Servicio</label>
                <select className="border-2 border-blue-800 text-center" name="servicio"  value={data["servicio"]}  onChange={handleChange} >
                    <option value=" "></option>
                    <option value="Hospitalizacion">Hospitalizacion</option>
                    <option value="Urgencias">Urgencias</option>
                    <option value="UCI neonatal">UCI neonatal</option>
                    <option value="UCI adulto">UCI adulto</option>
                    <option value="Cirugia">Cirugia</option>
                    <option value="Gineco">Gineco</option>
                    <option value="Autorizador">Autorizador</option>

                
                </select>
            </section>



            {data.servicio==="Autorizador" && <section className="flex w-2/5 flex-col">
                <label className="text-lg font-semibold">Usuario</label>
                
                <input type="text" className='border-2 border-blue-800' name="usuario"  onChange={handleChange}  />
        
            </section>}

            <section className="flex w-2/5 flex-col">
                <label className="text-lg font-semibold"  >Contraseña</label>
                <input type="password" value={data["pass"]}  className='border-2 border-blue-800' name="pass"  onChange={handleChange}  />

            </section>

            <button className="w-1/4 bg-blue-800 text-white p-1 border-2 border-blue-800 hover:text-blue-800 hover:bg-white transition-all duration-200" onClick={HandleLogIn} >Ingresar</button>
            <button className="font-bold underline text-blue-800"  onClick={()=>{ window.open('http://173.16.10.137/glpi/plugins/formcreator/front/formdisplay.php?id=1', '_blank'); }} >¿Has olvidado la contraseña?</button>
            </div>
        </div>
  )
}
