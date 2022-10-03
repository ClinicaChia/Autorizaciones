import React,{useEffect,useState,useMemo} from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import styles from '../styles/summary.module.css'
import io from "socket.io-client";
import axios from 'axios';
import  useTable  from '../hooks/useTable';
import Table from '../components/Table';






let socket;


const tipos = ["","CC","RC","TI","MS","PA","CE","AS","PE","PT","NU","CN"]


export default function Summary({Data,SOCKETS_URI}) {
    
    const data = Data.data


    const [localData,setLocalData] = useState({Cargo:''});
   
    const [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp,tipo,setTipo] = useTable(data)
    
    const [Inputs,setInputs] = useState({}) 

    const [Inputs2,setInputs2] = useState({}) 

    const handleChange = (e) => {
      setTipo(e.target.value)
    }
    
    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
    
      socket = io(SOCKETS_URI,{reconnection: true});
      
      socket.on("append", (data) => {
        setData1( (prev) => [...prev,...data])
       
      });
      socket.on("validate", (data) => {

        //setData1( data1.filter((item)=> item.TimeStap != data.TimeStap ) )
        setDataTemp(data)
        setData2( (prev) => [...prev,data])
        setCambio( (prev) => prev+1)
       
      });

      socket.on("update", (data) => {
        setData2( (prev) => {
        
          return prev.map( (val,index) =>{
            if(val.TimeStap == data.TimeStap){
              val.autorizacion = data.autorizacion
              val.anexo = data.anexo
              console.log(index)
              return val
            }
            return val
          } )
        })
      })
        
      };
    

    useEffect(() => {
        socketInitializer();
        setLocalData( JSON.parse(localStorage.getItem('data')) )
        
    }, []);







  
  return (
    
    <main className={styles.container}>
        <Navbar active={false}/>


        <div className= {styles.row} >

        <select   className={styles.identifacion} name="tipo" onChange={handleChange}  value={tipo} >
                {tipos.map((tipo,index) =>  <option key={index} value={tipo}>{tipo}</option> )}
        </select>

        <input className={styles.filtro} type="text" onChange={(e)=>{setFilter(e.target.value)}}  placeholder='Escriba la cedula para realizar el filtro...✍️' />


        </div>

        <Table  Tabla1={Tabla1}  Tabla2={Tabla2} 
        
        data1={data1} setData1={setData1} 
        
        setData2={setData2} socket={socket}

        Inputs={Inputs} setInputs={setInputs}

        Inputs2={Inputs2} setInputs2={setInputs2}

        localData={localData}
        />

        


    </main>
  )
}


export async function getServerSideProps(context) {
    const res = await axios.get(process.env.HOST_URI + "/api/getData")

    const data = await res.data
    return {
       props: { Data:data,SOCKETS_URI:process.env.SOCKETS_URI}, // will be passed to the page component as props
    }
}