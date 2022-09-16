import React,{useEffect,useState,useMemo} from 'react'
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

const priorizacionStyles = {
    1: styles.MB,
    2: styles.B,
    3: styles.M,
    4: styles.A,
    5: styles.MA,
}



let socket;


const useTable = (initalData) => {


    const [filter,setFilter] = useState('')
    const [data1,setData1] = useState([])
    const [data2,setData2] = useState([])
    const [dataTemp,setDataTemp] = useState({})
    const Tabla1 = useMemo(() => {
        if(filter == ''){
            return data1.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
        }
        let temp = data1.filter((item) => item.documento == filter )
        return temp.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
    },[filter,data1])

    const Tabla2 = useMemo(() => {

        if(filter == ''){
            return data2.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));
        }
        let temp = data2.filter((item) => item.documento == filter )
        return temp.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));

    },[filter,data2])

   
    useEffect(() => {

        if(initalData.length > 0){
            
            let temp = initalData.filter((item) => item.AuthTime ==0 )
            setData1(temp)
            temp = initalData.filter((item) => item.AuthTime !=0 )
            setData2(temp)

        }
    }, [])

    useEffect(() => {
        console.log(dataTemp)
        if(dataTemp.AuthTime){
            setData1(data1.filter((item) => item.TimeStap != dataTemp.TimeStap))
        }
        
    },[dataTemp])

   



    return [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp]
}


export default function Summary({data}) {

   
    const [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp] = useTable(data)
    
    const [Inputs,setInputs] = useState({})
    
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


    const HandleClik = (data) => {
        

        if(Inputs[data.TimeStap] && Inputs[data.TimeStap] != ''){
            setData1( data1.filter((item)=> item.TimeStap != data.TimeStap ) )
            data.autorizacion = Inputs[data.TimeStap];
            data.AuthTime = new Date().getTime();
            setData2( (prev) => [...prev,data])
            socket.emit('validate',data)
            axios.post('/api/update',{
                TimeStap : data.TimeStap,
                autorizacion:data.autorizacion,
                AuthTime:data.AuthTime,
            }).then((res) => {alert('Se ha actualizado la base de datos')})
            .catch((err) => {alert('Ha ocurrido un error')})
        }
        else{
            alert('Debe ingresar un valor en la autorizacion')
        }


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
        
        <input className={styles.filtro} type="text" onChange={(e)=>{setFilter(e.target.value)}}  placeholder='Escriba la cedula para realizar el filtro...✍️' />

        <section className={styles.row}>

            <Card titulo="Dias en UCI" numero={10} color="Crimson" />
            <Card titulo="Dias en Observación" numero={10} color="Gold" />
            <Card titulo="Dias en Hospitalización" numero={10} color="LimeGreen" />
            <Card titulo="Procedimientos" numero={10} color="DarkBlue" />

        </section>

        <table key={Tabla1.length} >
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Documento</th>
                    <th>Nombre del paciente</th>
                    <th>Servicio</th>
                    <th>Procedimiento</th>
                    <th>E.P.S</th>
                    <th>Priorizacion</th>
                    <th>Codigo</th>
                    <th>Estado</th>
                    <th>Acciones</th>

                </tr>
            </thead>

            <tbody>
                {Tabla1.map((item,index) => {
                    return(
                        <tr   key={index}>
                            <td>{item.fecha}</td>
                            <td>{item.hora}</td>
                            <td>{item.documento}</td>
                            <td>{item.nombre}</td>
                            <td>{item.servicio}</td>
                            <td>{item.procedimiento}</td>
                            <td>{item.EPS}</td>
                            <td  className={ priorizacionStyles[item.priorizacion] } >{priorizacion[item.priorizacion]}</td>
                            <td> <input name={item.TimeStap} defaultValue=""  onChange={  HandleChange } type="text" /> </td>
                            <td>PENDIENTE</td>
                            <td> <button name={item.TimeStap} className={styles.editButton}  onClick={ ()=> {HandleClik(item)} } >Editar</button> </td>
                        </tr>
                    )
                })}

                {Tabla2.map((item,index) => {
                    return(
                        <tr  className={styles.complete} key={index}>
                            <td>{item.fecha}</td>
                            <td>{item.hora}</td>
                            <td>{item.documento}</td>
                            <td>{item.nombre}</td>
                            <td>{item.servicio}</td>
                            <td>{item.procedimiento}</td>
                            <td>{item.EPS}</td>
                            <td>{priorizacion[item.priorizacion]}</td>
                            <td>{item.autorizacion}</td>
                            <td>AUTORIZADO</td>
                            <td> <button  disabled  >Editar</button> </td>
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