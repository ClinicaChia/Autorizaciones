import React,{useEffect,useState,useMemo} from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import styles from '../styles/summary.module.css'
import io from "socket.io-client";
import axios from 'axios';
import  useTable  from '../hooks/useTable';
import Table from '../components/Table';






let socket;





export default function Summary({data}) {

   
    const [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp] = useTable(data)
    

    
    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
    
      socket = io("http://173.16.10.193:3001",{reconnection: false});
      
      socket.on("append", (data) => {
        setData1( (prev) => [...prev,data])
       
      });
      socket.on("validate", (data) => {

        //setData1( data1.filter((item)=> item.TimeStap != data.TimeStap ) )
        setDataTemp(data)
        setData2( (prev) => [...prev,data])
        
       
      });
        
      };
    

    useEffect(() => {
        socketInitializer();
    }, []);







  
  return (
    
    <main className={styles.container}>
        <Navbar active={false}/>
        
        <input className={styles.filtro} type="text" onChange={(e)=>{setFilter(e.target.value)}}  placeholder='Escriba la cedula para realizar el filtro...✍️' />

        <section className={styles.row}>

            <Card titulo="Dias en UCI" numero={10} color="Crimson" />
            <Card titulo="Dias en Observación" numero={10} color="Gold" />
            <Card titulo="Dias en Hospitalización" numero={10} color="LimeGreen" />
            <Card titulo="Procedimientos" numero={10} color="DarkBlue" />

        </section>

        <Table  Tabla1={Tabla1}  Tabla2={Tabla2} 
        
        data1={data1} setData1={setData1} 
        
        setData2={setData2} socket={socket}
        />

        


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