import React,{useEffect,useState} from 'react'
import styles from '../styles/main.module.css'
import Navbar from '../components/Navbar'
import io from "socket.io-client";
import axios from 'axios';
let socket;

const priorizacion = {
  1:'muy baja',
  2:'baja',
  3:'media',
  4:'alta',
  5:'muy alta'
}
export default function Main({SOCKETS_URI,cups}) {


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
  })

  const [localData,setLocalData] = useState(null);


  //useEffect(() => {console.log(data)}, [data]);
  const onChange = (e) => {
    const val = e.target.value ;
 
    const lastChar = val.length?  val[val.length - 1].toUpperCase() : '11' ;

  if(  e.target.name =='documento' && (lastChar.charCodeAt(0) >= 48 && lastChar.charCodeAt(0) <= 57) && (lastChar !=' ' || lastChar=='11' )    )  {

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



  }

  const ChangePro = (e) => {
  
    setData({
      ...data,
      "procedimiento":{...data.procedimiento,[e.target.name]:e.target.value}
    })
  }
  
  const QueryDB = (e) => {
    //se hace la consulta a la base de datos
    setData({
      ...data,
      nombre: "nombre de prueba",
      EPS: "EPS de prueba",
    });
    
  }

  const AppendDB = (e) => {

    if( data.documento.length >= 5 && data.nombre.length > 0 && data.EPS.length > 0 ){

        const dataToSend = Object.keys(data.procedimiento).map( (key,index) => {

          const fecha = new Date();
          const fechaString = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
          const horaString = fecha.getHours() + ':' + fecha.getMinutes();

          const temp = {
            fecha: fechaString,
            hora: horaString,
            TimeStap: fecha.getTime() + index,
            AuthTime: 0,
            autorizacion:'',
            procedimiento: data.procedimiento[key],
            servicio: localData.usuario,
            anexo: ''
          }

          return {
            ...data,...temp
          }

        } );

        
        

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
          });
          setN(0);
        
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
    <div className={styles.container}>
        <Navbar active={true}/>
        <section>
          <h2>Informacion del paciente</h2>
          <div className={styles.row_consulta}> 

              <div className={styles.form_group}>

                <label htmlFor="nombre">Documento</label>
                <input className={styles.campo} type="text" name="documento" value={data["documento"]} onChange={onChange} autoComplete="off" />

              </div>

              <button className={styles.btn_consulta} onClick={QueryDB} >Consultar</button>
              
          </div>
              
             
        

          <div className={styles.form_group}>
                <label htmlFor="nombre">Nombre</label>
                <input className={styles.campo} type="text" name="nombre" value={data["nombre"]} onChange={onChange} autoComplete="off" />
          </div>

          <div className={styles.form_group}>
                <label htmlFor="nombre">E.P.S</label>
                <input className={styles.campo} type="text" name="EPS" value={data["EPS"]} onChange={onChange}  />
          </div>

        </section>
        
        <section>
          <h2>Informacion Medica del registro</h2>

          <div className={styles.form_group}>
                <label htmlFor="nombre">Procedimientos</label>
                {
                  Object.keys(data.procedimiento).map((key) => {

                    if(key == 0){
                      return(
                        <div key={key} className={styles.Procedimento_Field}>

                          <input list='cups' autoComplete='off' className={styles.campo2} type="text" name={key} value={data.procedimiento[key]} onChange={ChangePro} />
                          
                        </div>
                      )
                    }
                    return (
                      <div className={styles.Procedimento_Field} key={key} >

                        <input autoComplete='off' className={styles.campo2} list='cups' type="text" name={key} value={data["procedimiento"][key]} onChange={ChangePro} />
                        <button name={key} onClick={removePro} className={styles.Delete}>-</button>
                      </div>
                    )
                  })
                }

                    <datalist role="listbox" id='cups' className={styles.data} >

                    {cups.map( (item,key) => {
                      return(
                        <option style={{color: "red"}} key={key} value={ `${item.code} - ${item.name}`  } />
                      )
                    })}

                    </datalist>

                <button onClick={addPro}  className={styles.addButton}>+</button>
                

          </div>

          <div className={styles.form_group}>
                <label htmlFor="nombre">Priorización</label>
                <select  className={styles.Prio} name="priorizacion" onChange={onChange}>
                  <option value="1">Muy baja</option>
                  <option value="2">Baja</option>
                  <option value="3">Media</option>
                  <option value="4">Alta</option>
                  <option value="5">Muy alta</option>

                </select>
              
          </div>
          
        </section>

        <button className={styles.enviar} onClick={AppendDB} >Registrar</button>

    </div>
  )
}


export async function getServerSideProps(context) {

  console.log(process.env.CUPS_URI)
  const cups = await (await fetch(process.env.CUPS_URI)).json();
  return {
     props: { SOCKETS_URI: process.env.SOCKETS_URI,cups}, // will be passed to the page component as props
  }
}


