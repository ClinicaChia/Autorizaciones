import React,{useEffect} from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import styles from '../styles/summary.module.css'
import io from "socket.io-client";
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let socket;

export default function Summary() {

    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
    
      socket = io("http://173.16.10.193:3001");
        
        
      };
    

    useEffect(() => {
        socketInitializer();
    }, []);
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
                    <th>Codigo</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {data.map((item,index) => {
                    return(
                        <tr key={index}>
                            <td>2021-05-05</td>
                            <td>10:00</td>
                            <td>123456789</td>
                            <td>Nombre del paciente</td>
                            <td>Urgencias</td>
                            <td>Consulta</td>
                            <td>Alta</td>
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
