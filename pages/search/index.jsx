import React,{useState,useEffect} from 'react'
import Navbar from '../../components/Navbar'
import axios from 'axios'
const tipos = ["","CC","RC","TI","MS","PA","CE","AS","PE","PT","NU","CN"]

const estadoStyles = {
    "PENDIENTE":'p-3 border border-blue-800 text-red-400 font-semibold',
    "TRAMITE":'p-3 border border-blue-800 text-green-400 font-semibold',
    "AUTORIZADO":'p-3 border border-blue-800 text-green-400 font-semibold',
}


export default function Index() {

  

    const [data,setData] = useState({
        documento:'',
        tipo: '',
        nombre:'',
        EPS:'',
        Historial:[]
    })

    useEffect(() => {
    
    }, [data]);

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
    }

    const QueryDB = async () => {

        const res = await axios.get(`http://173.16.11.9:3007/api/search?documento=${data.documento}&tipo=${data.tipo}`)
      
        setData({...data,Historial:res.data,nombre:res.data[0].nombre,EPS:res.data[0].EPS})

        




    }
  return (
    <div>
        <Navbar active={3}/>
        
        <section className='w-full flex'>

            <article className='w-1/4 flex flex-col  pl-10 pt-7'>

                <h2 className='text-xl text-center text-blue-700 font-semibold'>Datos del Paciente</h2>
                
                <div className="flex flex-col mt-8"> 


                <label  className='italic text-blue-800' >Documento</label>

        

                    <div className='flex gap-3 w-full p-2 pl-0'>
                    <select    className="border-2 border-blue-800 rounded-md" name="tipo" onChange={onChange}  value={data["tipo"]} >
                        {tipos.map((tipo,index) =>  <option key={index} value={tipo}>{tipo}</option> )}
                    </select>
                    <input   className="w-8/12 border-2 border-blue-800 rounded-md p-1" type="text" name="documento" value={data["documento"]} onChange={onChange} autoComplete="off" />
                    

                    <button className="w-6/12 border-2 border-blue-800 rounded-md bg-blue-800 text-white hover:text-blue-800 hover:bg-white transition-all duration-200" onClick={QueryDB} >Consultar</button>

                    </div>

              
              
                </div>

                <div className="flex flex-col mt-5 w-full">
                    <label className=' italic text-blue-800' htmlFor="nombre">Nombre</label>
                    <input disabled className="w-full border-2 border-blue-800 rounded-lg p-1" type="text" name="nombre" value={data["nombre"]} onChange={onChange} autoComplete="off" />
                </div>

                <div className="flex flex-col mt-5 w-full mb-8">
                    <label className='italic text-blue-800' htmlFor="nombre">E.P.S</label>
                    <input disabled className="w-full   border-2 border-blue-800 rounded-lg p-1" type="text" name="EPS" value={data["EPS"]} onChange={onChange}  />
                </div>

            </article>

            <article className='w-3/4 flex flex-col items-center  pt-7 pr-4'>
                <h2 className='text-xl text-center text-blue-700 font-semibold'>Historial</h2>
                
                <div className='w-11/12 flex justify-center pt-7 text-clip'>
                    <table >
                        <thead>
                            <tr className='bg-blue-700 text-white text-center'>
                                <th className='p-2 text-center' >Fecha</th>
                                <th className='p-2'>Hora</th>
                                <th className='p-2'>Procedimiento</th>
                                <th className='p-2'>Servicio</th>
                                <th className='p-2'>Codigo</th>
                                <th className='p-2'>Anexo</th>
                                <th className='p-2'>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.Historial.map((historial,index) => {
                                return(
                                    <tr key={index}>
                                        <td className='p-3 text-center border border-blue-700' >{historial.fecha}</td>
                                        <td className='p-3 text-center border border-blue-700' >{historial.hora}</td>
                                        <td className='p-3 text-center border border-blue-700' >{historial.procedimiento}</td>
                                        <td className='p-3 text-center border border-blue-700' >{historial.servicio}</td>
                                        <td className='p-3 text-center border border-blue-700' >{historial.autorizacion}</td>
                                        <td className='p-3 text-center border border-blue-700' >{historial.anexo}</td>
                                        <td className={estadoStyles[historial.Estado]} >{historial.Estado}</td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>

                        

                    </table>

                </div>
                
            </article>

            

        </section>

        
    </div>
  )
}
