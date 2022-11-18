import React,{useEffect,useState,useMemo} from 'react'
import Navbar from '../components/Navbar'
import io from "socket.io-client";
import axios from 'axios';
import  useTable  from '../hooks/useTable';
import Table from '../components/Table';






let socket;


const tipos = ["","CC","RC","TI","MS","PA","CE","AS","PE","PT","NU","CN"]


export default function Summary({Data,SOCKETS_URI}) {
    
    const data = Data.data


    const [localData,setLocalData] = useState({Cargo:''});
   
    const [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp,tipo,setTipo,setCargo] = useTable(data)
    
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
           
              return val
            }
            return val
          } )
        })
      })
        
      };
    

    useEffect(() => {
        socketInitializer();
        const _data = JSON.parse(localStorage.getItem('data'))

        console.log( _data)
        setLocalData( _data )

        setCargo(_data.servicio)

        
    }, []);

    

  
  return (
    
    <main className="flex flex-col  justify-center items-center">
        <Navbar active={false}/>


        <div className= "flex w-1/3  justify-center gap-2 mt-12 mb-8">

        <select   className="w-2/12 text-center border-2 border-blue-800 text-base" name="tipo" onChange={handleChange}  value={tipo} >
                {tipos.map((tipo,index) =>  <option key={index} value={tipo}>{tipo}</option> )}
        </select>

        <input className="w-10/12 border-2 border-blue-800 text-base p-1" type="text" onChange={(e)=>{setFilter(e.target.value)}}  placeholder='Escriba la cedula para realizar el filtro...✍️' />


        </div>

        <div className='flex  w-11/12 ' >

            <Table  Tabla1={Tabla1}  Tabla2={Tabla2} 
            
            data1={data1} setData1={setData1} 
            
            setData2={setData2} socket={socket}

            Inputs={Inputs} setInputs={setInputs}

            Inputs2={Inputs2} setInputs2={setInputs2}

            localData={localData}
            />


        </div>

        
        


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