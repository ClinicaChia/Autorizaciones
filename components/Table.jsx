import React,{useState} from 'react'

import axios from 'axios'

const priorizacion = {
    1:'Muy baja',
    2:'Baja',
    3:'Media',
    4:'Alta',
    5:'Muy alta'
}


const priorizacionStyles = {
    1: 'bg-green-400 p-1 border border-blue-800 font-semibold',
    2: 'bg-green-300 p-1 border border-blue-800 font-semibold',
    3: 'bg-yellow-300 p-1 border border-blue-800 font-semibold',
    4: 'bg-yellow-400 p-1 border border-blue-800 font-semibold',
    5: 'bg-red-400 p-1 border border-blue-800 font-semibold',
}

const estadoStyles = {
    "PENDIENTE":'p-1 border border-blue-800 text-red-400 font-semibold',
    "TRAMITE":'p-1 border border-blue-800 text-green-400 font-semibold',
}




export default function Table({Tabla1,Tabla2,data1,setData1,setData2,socket,Inputs,setInputs,Inputs2,setInputs2,localData}) {


    console.log("local",localData)


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
        
        const _temp = JSON.parse(localStorage.getItem('data'))
        
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
                anexo:data.anexo,
                Autorizador: _temp.usuario
            }).then((res) => {alert('Se ha actualizado la base de datos')})
            .catch((err) => {alert('Ha ocurrido un error')})
           
        }
        else{
            axios.post('/api/changeState',{
                TimeStap : data.TimeStap,
                Estado:'TRAMITE'
            }).then((res) => {
                setData1( (prev) => {
                    return prev.map((item) => {
                        if(item.TimeStap == data.TimeStap){
                            item.Estado = 'TRAMITE'
                        }
                        return item
                    })
                })
                socket.emit('changeState',{"Estado":"TRAMITE","TimeStap":data.TimeStap})
                alert('Se ha actualizado a "EN TRAMITE"')

            })
            
        }


    }

    const handleUpdate = (data) => {
        const authTime = new Date().getTime();
        const auth = Inputs[data.TimeStap]?Inputs[data.TimeStap]:data.autorizacion
        const anexo = Inputs2[data.TimeStap]?Inputs2[data.TimeStap]:data.anexo
        const _temp = JSON.parse(localStorage.getItem('data'))
        if(data){
            axios.post('/api/update',{
                TimeStap : data.TimeStap,
                autorizacion:auth,
                AuthTime:authTime,
                anexo:anexo,
                Autorizador: _temp.usuario
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
    <table key={Tabla1.length} className="w-full mb-28" >
            <thead className='bg-blue-800' >
                <tr className='text-center text-white h-12' >
                    <th className='border-2 p-1 border-l-blue-800' >Fecha</th>
                    <th className='border-2 p-1'>Hora</th>
                    <th className='border-2 p-1'>Documento</th>
                    <th className='border-2 p-1'>Nombre del paciente</th>
                    <th className='border-2 p-1'>Servicio</th>
                    <th className='border-2 p-1'>Procedimiento</th>
                    <th className='border-2 p-1'>E.P.S</th>
                    <th className='border-2 p-1'>Priorizacion</th>
                    { localData.servicio ==="Autorizador"? <th className='border-2 p-1  border-r-blue-800' >Codigo</th>: null}
                    { localData.servicio ==="Autorizador"? <th className='border-2 p-1  border-r-blue-800' >Anexo</th>: null}
                    <th className='border-2 p-1'>Estado</th>
                    { localData.servicio ==="Autorizador"? <th className='border-2 p-1  border-r-blue-800' >Acciones</th>: null}

                </tr>
            </thead>

            <tbody className='text-xs text-center' >
                {Tabla1.map((item,index) => {
                    return(
                        <tr   key={index}>
                            <td className='p-1 border border-blue-800'>{item.fecha}</td>
                            <td className='p-1 border border-blue-800'>{item.hora}</td>
                            <td className='p-1 border border-blue-800'>{`${item.tipo} ${item.documento}`}</td>
                            <td className='p-1 border border-blue-800'>{item.nombre}</td>
                            <td className='p-1 border border-blue-800'>{item.servicio}</td>
                            <td className='p-1 border border-blue-800'>{item.procedimiento}</td>
                            <td className='p-1 border border-blue-800'>{item.EPS}</td>
                            <td  className={ priorizacionStyles[item.priorizacion]  } >{priorizacion[item.priorizacion]}</td>
                             { localData.servicio ==="Autorizador" ? <td className='p-1 border border-blue-800'> <textarea name={item.TimeStap} defaultValue="" className='border border-black'  onChange={  HandleChange }  />   </td> :null } 
                             { localData.servicio ==="Autorizador" ? <td className='p-1 border border-blue-800'>   <select name={item.TimeStap}   className='border border-black w-20 text-center'  onChange={  HandleChange2 }  >

                                <option value=''> </option>
                                <option value="ANEXO 1">ANEXO 1</option>
                                <option value="ANEXO 2">ANEXO 2</option>
                                <option value="ANEXO 3">ANEXO 3</option>
                                <option value="ANEXO 4">ANEXO 4</option>
                                <option value="ANEXO 5">ANEXO 5</option>
                                <option value="ANEXO 6">ANEXO 6</option>
                                <option value="ANEXO 7">ANEXO 7</option>
                                <option value="ANEXO 8">ANEXO 8</option>

                            </select> </td> : null} 
                            <td className={ estadoStyles[item.Estado] }>{item.Estado}</td>
                            { localData.servicio ==="Autorizador"? <td className='p-1 border border-blue-800' > <button name={item.TimeStap} className="w-16 h-8 bg-yellow-400 border border-yellow-400 hover:bg-white transition-all duration-200"  onClick={ ()=> {HandleClik(item)} } >Actualizar</button> </td> : null} 
                        </tr>
                    )
                })}

                {Tabla2.map((item,index) => {
                    console.log(item)
                    return(
                        <tr className='bg-gray-400 text-white font-semibold' key={index}>
                            <td className='p-1 border border-blue-800' >{item.fecha}</td>
                            <td className='p-1 border border-blue-800'>{item.hora}</td>
                            <td className='p-1 border border-blue-800'>{`${item.tipo} ${item.documento}`}</td>
                            <td className='p-1 border border-blue-800'>{item.nombre}</td>
                            <td className='p-1 border border-blue-800'>{item.servicio}</td>
                            <td className='p-1 border border-blue-800'>{item.procedimiento}</td>
                            <td className='p-1 border border-blue-800'>{item.EPS}</td>
                            <td className='p-1 border border-blue-800'>{priorizacion[item.priorizacion]}</td>
                            { localData.servicio ==="Autorizador"? <td className='p-1 border border-blue-800'>  <textarea className='text-black' name={item.TimeStap}  key={item.autorizacion.length} defaultValue={item.autorizacion} onChange={  HandleChange } />  </td> : null }
                            { localData.servicio ==="Autorizador" ? <td className='p-1 border border-blue-800'>  <select name={item.TimeStap} defaultValue={item.anexo} key={item.anexo}  value={Inputs2[item.TimeStap]}  className='border border-black w-20 text-center text-black'  onChange={  HandleChange2 }  >

                                <option value=''> </option>
                                <option value="ANEXO 1">ANEXO 1</option>
                                <option value="ANEXO 2">ANEXO 2</option>
                                <option value="ANEXO 3">ANEXO 3</option>
                                <option value="ANEXO 4">ANEXO 4</option>
                                <option value="ANEXO 5">ANEXO 5</option>
                                <option value="ANEXO 6">ANEXO 6</option>
                                <option value="ANEXO 7">ANEXO 7</option>
                                <option value="ANEXO 8">ANEXO 8</option>

                            </select> </td> : null} 
                            <td className='p-1 border border-blue-800' >AUTORIZADO</td>
                             { localData.servicio ==="Autorizador"? <td className='p-1 border border-blue-800'> <button name={item.TimeStap} className="w-16 h-8 bg-inherit border border-white hover:bg-white hover:text-black transition-all duration-200"  onClick={ ()=> {handleUpdate(item)} } >Actualizar</button> </td> : null } 
                        </tr>
                    )
                })}
            </tbody>
        </table>
  )
}
