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




export default function Table({Tabla1,Tabla2,data1,setData1,setData2,socket,Inputs,setInputs,Inputs2,setInputs2,localData}) {

    const HandleChange = (e) => {
        setInputs({
            ...Inputs,
            [e.target.name]:e.target.value
        })
    }

    const HandleChange2 = (e) => {
        setInputs2({
            ...Inputs2,
            [e.target.name]:e.target.value
        })
    }

    const HandleClik = (data) => {
        

        if(Inputs[data.TimeStap] && Inputs[data.TimeStap] != ''){
            setData1( data1.filter((item)=> item.TimeStap != data.TimeStap ) )
            data.autorizacion = Inputs[data.TimeStap];
            data.AuthTime = new Date().getTime();
            data.anexo = Inputs2[data.TimeStap];
            setData2( (prev) => [...prev,data])
            socket.emit('validate',data)
            axios.post('/api/update',{
                TimeStap : data.TimeStap,
                autorizacion:data.autorizacion,
                AuthTime:data.AuthTime,
                anexo:data.anexo
            }).then((res) => {alert('Se ha actualizado la base de datos')})
            .catch((err) => {alert('Ha ocurrido un error')})
        }
        else{
            alert('Debe ingresar un valor en la autorizacion')
        }


    }

    const handleUpdate = (data) => {
        const authTime = new Date().getTime();
        const auth = Inputs[data.TimeStap]?Inputs[data.TimeStap]:data.autorizacion
        const anexo = Inputs2[data.TimeStap]?Inputs2[data.TimeStap]:data.anexo
        if(data){
            axios.post('/api/update',{
                TimeStap : data.TimeStap,
                autorizacion:auth,
                AuthTime:authTime,
                anexo:anexo
            }).then((res) => {
                socket.emit('update',{TimeStap : data.TimeStap,autorizacion:auth,anexo:anexo})
                alert('Se ha actualizado la base de datos')})
            .catch((err) => {alert('Ha ocurrido un error')})
        }
        else{
            alert('Debe ingresar un valor en la autorizacion diferente al registrado en la base de datos')
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
                    <th>Anexo</th>
                    <th>Estado</th>
                    { localData.Cargo ==="Facturador"? <th>Acciones</th>: null}

                </tr>
            </thead>

            <tbody>
                {Tabla1.map((item,index) => {
                    return(
                        <tr   key={index}>
                            <td>{item.fecha}</td>
                            <td>{item.hora}</td>
                            <td>{`${item.tipo} ${item.documento}`}</td>
                            <td>{item.nombre}</td>
                            <td>{item.servicio}</td>
                            <td>{item.procedimiento}</td>
                            <td>{item.EPS}</td>
                            <td  className={ priorizacionStyles[item.priorizacion] } >{priorizacion[item.priorizacion]}</td>
                            <td>    { localData.Cargo ==="Facturador" ? <input name={item.TimeStap} defaultValue=""  onChange={  HandleChange } type="text" /> :null }   </td>
                            <td> { localData.Cargo ==="Facturador" ? <input name={item.TimeStap} defaultValue=""  onChange={  HandleChange2 } type="text" /> : null} </td>
                            <td>PENDIENTE</td>
                            { localData.Cargo ==="Facturador"? <td> <button name={item.TimeStap} className={styles.editButton}  onClick={ ()=> {HandleClik(item)} } >Actualizar</button> </td> : null} 
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
                            <td> { localData.Cargo ==="Facturador"? <input name={item.TimeStap}  key={item.autorizacion.length} defaultValue={item.autorizacion} onChange={  HandleChange } type="text" /> : item.autorizacion } </td>
                            <td> { localData.Cargo ==="Facturador"? <input name={item.TimeStap}  key={item.autorizacion.length} defaultValue={item.anexo} onChange={  HandleChange2 } type="text" /> : item.anexo} </td>
                            <td>AUTORIZADO</td>
                             { localData.Cargo ==="Facturador"? <td> <button name={item.TimeStap} className={styles.editButton}  onClick={ ()=> {handleUpdate(item)} } >Editar</button> </td> : null } 
                        </tr>
                    )
                })}
            </tbody>
        </table>
  )
}
