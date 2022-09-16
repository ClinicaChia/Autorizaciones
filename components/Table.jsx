import React,{useState} from 'react'
import styles from '../styles/summary.module.css'
import axios from 'axios'

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




export default function Table({Tabla1,Tabla2,data1,setData1,setData2,socket}) {

    const [Inputs,setInputs] = useState({}) 

    const HandleChange = (e) => {
        setInputs({
            ...Inputs,
            [e.target.name]:e.target.value
        })
    }

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

  return (
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
  )
}
