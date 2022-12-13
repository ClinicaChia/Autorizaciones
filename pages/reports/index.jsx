import React,{useState} from 'react';
import Navbar from '../../components/Navbar';
import Fecha from './fecha';
import Botonera from './botonera';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
const Index = () => {
    const router = useRouter(); 
    const [fechas,setFechas] = useState({
        fechaInicio:'',
        fechaFin:''
    })

    const changeFecha = (key,value) =>{
        setFechas({
            ...fechas,
            [key]:value
        })
    }

    const Indicadores = (type) => {
  
        
       //donwload file that come from the server
       axios.get('/api/reports',{params:{indicador:type, fechaI:fechas.fechaInicio, fechaF:fechas.fechaFin}})
        .then(res => {
            
            router.push(`api/reports?indicador=${type}&fechaI=${fechas.fechaInicio}&fechaF=${fechas.fechaFin}`)
            
            
        })
        .catch(err => console.log(err))
    
        
    }

    return (
        
        <div className='w-screen flex flex-col items-center justify-center'>
            <Navbar active={4}/>

            <h2 className='text-blue-700 text-2xl mt-8 font-semibold'>Selecionar Fechas de corte y el reporte que desea descargar</h2>

            <section className='w-3/4  p-4 flex justify-evenly mt-4' >
                <Fecha msm="Fecha Inicio: " name="fechaInicio" updateFecha={changeFecha} fecha={fechas.fechaInicio} />
                <Fecha msm="Fecha Final: " name="fechaFin" updateFecha={changeFecha} fecha={fechas.fechaFin}/>
            </section>
            
            <Botonera submit={Indicadores} />
        </div>
    );
}

export default Index;
