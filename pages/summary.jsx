import React,{useEffect,useState} from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import styles from '../styles/summary.module.css'
import io from "socket.io-client";
import axios from 'axios';


const priorizacion = {
    1:'muy baja',
    2:'baja',
    3:'media',
    4:'alta',
    5:'muy alta'
}

let socket;



export default function Summary({data}) {

    console.log(data)
    const [arr,setArr] = useState(data)
    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
    
      socket = io("http://173.16.10.193:3001",{reconnection: true});
      
      socket.on("hello", (data) => {
        console.log([...arr,data]);
       setArr( (arr) => [...arr,data] )
      });
        
      };
    

    useEffect(() => {
        socketInitializer();
    }, []);

    useEffect(() => {
        console.log(arr)
    }, [arr]);
  return (
    
    <main className={styles.container}>
        <Navbar active={false}/>
        
        <input className={styles.filtro} type="text"  placeholder='Escriba la cedula para realizar el filtro...✍️' />

        <section className={styles.row}>

            <Card titulo="Dias en UCI" numero={10} color="Crimson" />
            <Card titulo="Dias en Observación" numero={10} color="Gold" />
            <Card titulo="Dias en Hospitalización" numero={10} color="LimeGreen" />
            <Card titulo="Procedimientos" numero={10} color="DarkBlue" />

        </section>

        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Documento</th>
                    <th>Nombre del paciente</th>
                    <th>Servicio</th>
                    <th>Procedimiento</th>
                    <th>Priorizacion</th>
                    <th>E.P.S</th>
                    <th>Codigo</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {arr.map((item,index) => {
                    return(
                        <tr key={index}>
                            <td>{item.fecha}</td>
                            <td>{item.hora}</td>
                            <td>{item.documento}</td>
                            <td>{item.nombre}</td>
                            <td>{item.servicio}</td>
                            <td>{item.procedimiento}</td>
                            <td>{item.EPS}</td>
                            <td>{priorizacion[item.priorizacion]}</td>
                            <td> <input type="text" /> </td>
                            <td> <button>Editar</button> </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </main>
  )
}


export async function getServerSideProps(context) {
    const res = await axios.get(process.env.HOST_URI + "/api/getData")
    console.log(res)
    const data = await res.data
    return {
       props: data
    }
}