import React,{useEffect,useState} from 'react'
import styles from '../styles/main.module.css'
import Navbar from '../components/Navbar'
import io from "socket.io-client";
import axios from 'axios';
let socket;
export default function main() {

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it

  socket = io("http://173.16.10.193:3001");
    
    
  };
useEffect(() => {
    socketInitializer();
}, []);

  const [data,setData] = useState({
    documento:'',
    nombre:'',
    EPS:'',
    procedimiento:'',
    priorizacion:'3',
  })

  const onChange = (e) => {
    const val = e.target.value ;
 
    const lastChar = val.length?  val[val.length - 1].toUpperCase() : '11' ;
    console.log(lastChar)
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
  
  const QueryDB = (e) => {
    //se hace la consulta a la base de datos

    setData({
      ...data,
      nombre: "nombre de prueba",
      EPS: "EPS de prueba",
    });
    
  }

  useEffect(() => { console.log(data) }, [data]);

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
                <label htmlFor="nombre">Procedimiento</label>
                <input className={styles.campo} type="text" name="Procedimiento" value={data["procedimiento"]} onChange={onChange} />
          </div>

          <div className={styles.form_group}>
                <label htmlFor="nombre">Priorizacion: {data["priorizacion"]}</label>
                <input className={styles.barra} type="range" id="vol" name="priorizacion" min="1" max="5"  onChange={onChange} />
          </div>
          
        </section>

        <button className={styles.enviar}>Registrar</button>

    </div>
  )
}
