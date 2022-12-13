// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'
import { MongoClient } from 'mongodb'
const  XLSX = require("xlsx");
import fs from 'fs'

const Indicador1 = async (fechaI,fechaF) => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");

  

  const data = await collection.find({TimeStap: {$gte: fechaI,$lte: fechaF }}).toArray();

  const _eps = data.map((item) => item.EPS);
  const __eps = [...new Set(_eps)].map((item) => {
  //delete de last caracter of the string if is a space
    if (item[item.length - 1] === " ") {
      item = item.slice(0, -1);
    }
    //delete the frist caracter of the string if is a space
    if (item[0] === " ") {
      item = item.slice(1);
    }


    return item;

});

  const eps = [...new Set(__eps)];

  const total = []
  eps.forEach((item) => {
    //count the number of times that the item is in the array data with regex
    const Solicitadas = data.filter((item2) => item2.EPS.match(item) ).length;
    const Autorizadas = data.filter((item2) => item2.EPS.match(item) && item2.Estado === "AUTORIZADO").length;

    total.push({EPS: item, Solicitadas, Autorizadas})

  });



  //save the data in a excel file
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(total);
  await XLSX.utils.book_append_sheet(wb, ws, "Indicador1");

  


  
  client.close();

  return wb

  
}

const Indicador2 = async (fechaI,fechaF) => {

  const anexos =["ANEXO 1","ANEXO 2","ANEXO 3","ANEXO 4","ANEXO 5","ANEXO 6","ANEXO 7","ANEXO 8"]
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");

  const data = await collection.find({TimeStap: {$gte: fechaI,$lte: fechaF }}).toArray();

  const _eps = data.map((item) => item.EPS);
  const __eps = [...new Set(_eps)].map((item) => {
  //delete de last caracter of the string if is a space
    if (item[item.length - 1] === " ") {
      item = item.slice(0, -1);
    }
    //delete the frist caracter of the string if is a space
    if (item[0] === " ") {
      item = item.slice(1);
    }


    return item;

});

  const eps = [...new Set(__eps)];

  
  
  const total = []

  eps.forEach((item) => {

    let temp = {}

    anexos.forEach((item2) => {
      const Solicitadas = data.filter((item3) => item3.EPS.match(item) && item3.anexo === item2).length;

      temp = {...temp, [item2]: Solicitadas}
      
    })

    const count = Object.values(temp).reduce((a, b) => a + b, 0);

    total.push({EPS: item,...temp,total: count})
    
  });





  //save the data in a excel file
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(total);
  XLSX.utils.book_append_sheet(wb, ws, "Indicador2");
  XLSX.writeFile(wb, "Indicador2.xlsx");



  return wb

}

const Indicador3 = async (fechaI,fechaF) => {
  const anexos =["ANEXO 1","ANEXO 2","ANEXO 3","ANEXO 4","ANEXO 5","ANEXO 6","ANEXO 7","ANEXO 8"]
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");

  const data = await collection.find({TimeStap: {$gte: fechaI,$lte: fechaF }}).toArray();

  const _eps = data.map((item) => item.EPS);
  const __eps = [...new Set(_eps)].map((item) => {
  //delete de last caracter of the string if is a space
    if (item[item.length - 1] === " ") {
      item = item.slice(0, -1);
    }
    //delete the frist caracter of the string if is a space
    if (item[0] === " ") {
      item = item.slice(1);
    }


    return item;

});
  
const total = []

  const eps = [...new Set(__eps)];

  eps.forEach((item) => {

    const _data = data.filter((item2) => item2.EPS.match(item) && item2.AuthTime > 0 )

    const n = _data.length

    const sum = _data.reduce((a, b) => a + (b.AuthTime - b.TimeStap), 0);
    
    const promedio = sum / (n*1000*60*60)

    total.push({EPS: item, "Tiempo Respuesta Promedio":promedio})
    

  })

 
  //save the data in a excel file
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(total);
  XLSX.utils.book_append_sheet(wb, ws, "Indicador3");
  


  return wb

}

const Indicador4 = async (fechaI,fechaF) => {

  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Servicios");
  const indicadoresCollection = db.collection("Historial_aut");

  const data = await collection.find({Cargo: "Facturador"}).toArray();

  const timeData = await indicadoresCollection.find({TimeStap: {$gte: fechaI,$lte: fechaF }}).toArray();

  const autorizadores = data.map((item) => item.usuario);

 

  const wb = XLSX.utils.book_new();

  //append autorizadores with filter in wb
  autorizadores.forEach((item) => {
    const temp = timeData.filter((item2) => item2.perfil === item).map((item3) => {
      return { fecha: item3.fecha ,  nombre: item3.Autorizador , total: item3.total, porcentaje : item3.porcentaje}
    })  ;

    
    const ws = XLSX.utils.json_to_sheet(temp);
    XLSX.utils.book_append_sheet(wb, ws, item );


  });


  return wb


  

}


export default async  function handler(req, res) {

  if(req.method === 'GET'){

    const {indicador,fechaI,fechaF} = req.query;


    const fecha1 = new Date(fechaI);
    const fecha2 = new Date(fechaF);

  let wb = []
   switch (indicador) {
      case "1":
        wb = await Indicador1(fecha1.getTime(),fecha2.getTime());
        break;
      case "2":
         wb = await Indicador2(fecha1.getTime(),fecha2.getTime());
        break;
      case "3":
         wb = await Indicador3(fecha1.getTime(),fecha2.getTime());
        break;
      case "4":
         wb = await Indicador4(fecha1.getTime(),fecha2.getTime());
        break;
        default:
          wb = [];

   }

    

    //send wb as xlsx file to the client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Indicador1.xlsx');
    res.end(XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }));

  

  }
  else if(req.method === 'POST'){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()  ;
    const day = date.getDate() ;
  
    const D1 = new Date(year, month, day-1);
    const D2 = new Date(year, month, day );
  
  
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("Autorizaciones");
    const collectionAut = db.collection("Historial_aut");
    const collection = db.collection("Historial");
    const collectionServicios = db.collection("Servicios");
  
    const data = await collection.find({AuthTime: {$gte: D1.getTime(),$lte: D2.getTime() } }).toArray();
  
    const data2 = await collectionServicios.find({Cargo: "Facturador"}).toArray();
  
    const autorizadores = data2.map((item) => item.autorizador);
    const usuarios = data2.map((item) => item.usuario);
    const len = data.length;
    const total = []
    usuarios.forEach((item,index) => {
      const temp = data.filter((item2) => item2.Autorizador === item).length
  
  
      //const n = temp.length
      //const sum = temp.reduce((a, b) => a + (b.AuthTime - b.TimeStap), 0);
      //const promedio = sum / (n*1000*60*60)
      //const _data = {usuario: item, "Tiempo Respuesta Promedio":promedio}
      //collectionAut.insertOne(_data)
      
  
      total.push({Autorizador: autorizadores[index], total: temp , porcentaje: (temp/len)*100 , fecha : `${D1.getDate()}/${D1.getMonth()+1}/${D1.getFullYear()}`, TimeStap: D1.getTime(), perfil: item})
  
  
    })
  
  
  
    await collectionAut.insertMany(total)
    
    res.status(200).json({message: "ok"})
    //await collection.insertMany()
  
  } // para almacenar los datos de los indicadores en la base de datos
   res.status(404).json({message: "Method not allowed"})
}
