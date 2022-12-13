import React,{useEffect,useState} from 'react'
import Navbar from '../components/Navbar'
import io from "socket.io-client";
import axios from 'axios';
let socket;


const tipos = ["","CC","RC","TI","MS","PA","CE","AS","PE","PT","NU","CN"]

export default function Main({SOCKETS_URI,cups,eps}) {

  const [existe,setExiste] = useState(false)

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
  socket = io(SOCKETS_URI,{reconnection: true});
  
    
  };
useEffect(() => {
    socketInitializer();
    setLocalData( JSON.parse(localStorage.getItem('data')) )

}, []);

  const [n, setN] = useState(0)

  const [data,setData] = useState({
    documento:'',
    nombre:'',
    EPS:'',
    procedimiento:{ [n] :''},
    priorizacion:'1',
    tipo: '',
  })

  const [localData,setLocalData] = useState(null);


  const onChange = (e) => {
    
    const val = e.target.value ;

    const lastChar = val.length?  val[val.length - 1].toUpperCase() : '11' ;

  if(  e.target.name =='documento' && ( lastChar.charCodeAt(0)===45 ||  (lastChar.charCodeAt(0) >= 48 && lastChar.charCodeAt(0) <= 57)) && (lastChar !=' ' || lastChar=='11' )    )  {

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

  }

  else if( e.target.name != 'documento' && (lastChar.charCodeAt(0) >= 65 && lastChar.charCodeAt(0) <= 90) || lastChar ==' ' || lastChar=='11' ){

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  else if( e.target.name == "priorizacion" ){
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  else if( e.target.name === "EPS"){
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }



  }

  const ChangePro = (e) => {
  
    setData({
      ...data,
      "procedimiento":{...data.procedimiento,[e.target.name]:e.target.value}
    })
  }
  
  const QueryDB = (e) => {
    //se hace la consulta a la base de datos

    axios.get('/api/getPaciente',{
      params:{ documento:data.documento,tipo : data.tipo }
    }).then((res)=>{  

      const paciente = res.data;
      setData({
        ...data,
        nombre: paciente.Nombre,
        EPS: paciente.EPS,
        tipo: paciente.Tipo,
      });

      setExiste(true)

      }).catch((err)=>{
        alert( "Paciente no encontrado, cuando se registre se agregara a la base de datos, recuerde revisar el tipo de documento" )
        setExiste(false)
      })

    
  }

  const AppendDB = (e) => {

    if( data.documento.length >= 5 && data.nombre.length > 0 && data.EPS.length > 0 && data.tipo.length > 1 ){

        const dataToSend = Object.keys(data.procedimiento).map( (key,index) => {

          const fecha = new Date();
          const fechaString = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
          const horaString = fecha.getHours() + ':' + fecha.getMinutes();

          const temp = {
            documento: data.documento,
            fecha: fechaString,
            hora: horaString,
            TimeStap: fecha.getTime() + index,
            AuthTime: 0,
            autorizacion:'',
            procedimiento: data.procedimiento[key],
            servicio: localData.usuario,
            anexo: '',
            EPS : data.EPS.toLocaleUpperCase(),
            Estado: 'PENDIENTE',
             
          }

          return {
            ...data,...temp
          }

        } );

        
        axios.post('/api/Register',{
          documento: data.documento,
          Nombre:data.nombre,
          EPS:data.EPS.toUpperCase(),
          Tipo:data.tipo,
          existe,
        }
        ).catch((err)=>{alert("Error al registrar al paciente")});
      
      

        axios.post('/api/add', dataToSend)
        .then(res => {
          socket.emit('append', dataToSend);
          alert("Se cargo correacmente el paciente");
          setData({
            documento:'',
            nombre:'',
            EPS:'',
            procedimiento:{ [0] :''},
            priorizacion:'1',
            tipo: '',
          });
          setN(0);
          setExiste(false);
        
        })
        .catch(err => console.log(err));
    }

    else{
      alert("Hay campos vacios o con datos incorrectos");
    }

 
  }

  const addPro = (e) => {
    setData({
      ...data,
      "procedimiento":{...data.procedimiento,[n+1]:""}
    })

    setN(n+1)
  }

  const removePro = (e) => {
    const temp = data.procedimiento;
     delete temp[e.target.name];
    setData({ ...data, "procedimiento":temp})
  }

  return (
    <div className="w-full flex flex-col items-center">
        <Navbar active={1}/>
        <section className='w-2/4 flex flex-col mt-5' >
          <h2 className='text-center text-xl font-bold'>Informacion del paciente</h2>
          <div className="flex flex-col mt-8"> 


                <label htmlFor="nombre" className='italic text-blue-800' >Documento</label>

      

              <div className='flex gap-4 w-full p-2 pl-0'>

              <input  disabled={existe} className="w-3/6 border-2 border-blue-800 rounded-md p-1" type="text" name="documento" value={data["documento"]} onChange={onChange} autoComplete="off" />
              <select  disabled={existe}  className="border-2 border-blue-800 rounded-md" name="tipo" onChange={onChange}  value={data["tipo"]} >
                {tipos.map((tipo,index) =>  <option key={index} value={tipo}>{tipo}</option> )}
              </select>

              <button className="w-2/12 border-2 border-blue-800 rounded-md bg-blue-800 text-white hover:text-blue-800 hover:bg-white transition-all duration-200" onClick={QueryDB} >Consultar</button>

              </div>

              
              
          </div>
              
             
        

          <div className="flex flex-col mt-5 w-full">
                <label className=' italic text-blue-800' htmlFor="nombre">Nombre</label>
                <input disabled={existe} className="w-3/6 border-2 border-blue-800 rounded-lg p-1" type="text" name="nombre" value={data["nombre"]} onChange={onChange} autoComplete="off" />
          </div>

          <div className="flex flex-col mt-5 w-full mb-8">
                <label className='italic text-blue-800' htmlFor="nombre">E.P.S</label>
                
                
                <input list='eps' className="w-3/6 border-2 border-blue-800 rounded-lg p-1" type="text" name="EPS" value={data["EPS"]} onChange={onChange} />

          </div>

        </section>
        
        <section className='w-2/4 flex flex-col mt-5' >
          <h2 className='text-center font-bold text-xl'>Informacion Medica del registro</h2>

          <div className="flex flex-col w-full">
                <label htmlFor="nombre" className='italic text-blue-800 mt-5' >Procedimientos</label>
                {
                  Object.keys(data.procedimiento).map((key) => {

                    if(key == 0){
                      return(
                        <div key={key} className=" p-1 pl-0">

                          <input list='cups' autoComplete='off' className="p-1 pl-0 w-5/6 border border-blue-800 rounded-sm" type="text" name={key} value={data.procedimiento[key]} onChange={ChangePro} />
                          
                        </div>
                      )
                    }
                    return (
                      <div className="flex gap-3 items-center" key={key} >

                        <input autoComplete='off' className="p-1 pl-0 w-5/6 border border-blue-800 rounded-sm mt-4" list='cups' type="text" name={key} value={data["procedimiento"][key]} onChange={ChangePro} />
                        <button name={key} onClick={removePro} className="text-red-500 text-2xl w-8 p-1 pl-0 mt-4 cursor-pointer">-</button>
                      </div>
                    )
                  })
                }
                    

                    <datalist role="listbox" id="eps" > 

                      {eps.map((eps,index) => <option key={index} value={eps.Nombre} />)}

                    </datalist>

                    <datalist role="listbox" id='cups'  >

                    {cups.map( (item,key) => {
                      return(
                        <option style={{color: "red"}} key={key} value={ `${item.code} - ${item.name}`  } />
                      )
                    })}

                    </datalist>

                <button onClick={addPro}  className="mt-3 text-3xl text-green-500 rounded-full hover:bg-green-500 w-8 hover:text-white transition-all duration-300 self-center">+</button>
                

          </div>

          <div className="flex flex-col w-full  ">
                <label htmlFor="nombre" className='italic text-blue-800 mb-2 ' >Priorización</label>
                <select  className="w-2/6 border-2 border-blue-800 text-center" name="priorizacion" onChange={onChange}>
                  <option value="1">Muy baja</option>
                  <option value="2">Baja</option>
                  <option value="3">Media</option>
                  <option value="4">Alta</option>
                  <option value="5">Muy alta</option>

                </select>
              
          </div>
          
        </section>

        <button className="w-32 bg-yellow-400 h-8 p-2 mt-10 mb-10 rounded-md hover:bg-yellow-500 transition-all duration-200" onClick={AppendDB} >Registrar</button>

    </div>
  )
}


export async function getServerSideProps(context) {

 
  const cups = await (await fetch(process.env.CUPS_URI)).json();
  const eps = await (await fetch(process.env.EPS_URI)).json();
  return {
     props: { SOCKETS_URI: process.env.SOCKETS_URI,cups , eps}, // will be passed to the page component as props
  }
}
"Paciente no encontrado, cuando se registre se agregara a la base de datos"

