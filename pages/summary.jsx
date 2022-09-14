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


const useTable = (initalData) => {

    const [Data,setData] = useState(initalData)
    const [filter,setFilter] = useState('')
    const [data1,setData1] = useState([])
    const [data2,setData2] = useState([])

    useEffect(() => {

    }, [Data])



    return [Data,setData,filter,setFilter,data1,setData1,data2,setData2]
}


export default function Summary({data}) {

   
    const [Data,setData,filter,setFilter,data1,setData1,data2,setData2]= useTable(data)
    
    const [Inputs,setInputs] = useState({})
    
    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
    
      socket = io("http://localhost:3001",{reconnection: true});
      
      socket.on("hello", (data) => {
       setData( (Data) => [...Data,data] )
      });
        
      };
    

    useEffect(() => {
        socketInitializer();
    }, []);


    const HandleClik = (e) => {
        

        const temp = Data.filter( (item) => item.TimeStap != e.target.name)
        setData( temp  )

        delete Inputs[e.target.name]

    }

    const HandleChange = (e) => {
        setInputs({
            ...Inputs,
            [e.target.name]:e.target.value
        })
    }



  
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

        <table key={Data.length} >
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
                {Data.map((item,index) => {
                    return(
                        <tr  className={styles.tableR} key={index}>
                            <td>{item.fecha}</td>
                            <td>{item.hora}</td>
                            <td>{item.documento}</td>
                            <td>{item.nombre}</td>
                            <td>{item.servicio}</td>
                            <td>{item.procedimiento}</td>
                            <td>{item.EPS}</td>
                            <td>{priorizacion[item.priorizacion]}</td>
                            <td> <input name={item.TimeStap} defaultValue=""  onChange={HandleChange} type="text" /> </td>
                            <td> <button name={item.TimeStap}  onClick={HandleClik} >Editar</button> </td>
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

    const data = await res.data
    return {
       props: data
    }
}