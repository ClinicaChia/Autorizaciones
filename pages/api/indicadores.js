// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'
import { MongoClient } from 'mongodb'
const  XLSX = require("xlsx");


const Indicador1 = async (fechaI,fechaF) => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("Autorizaciones");
  const collection = db.collection("Historial");

  console.log(fechaI,fechaF)

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

  console.log(total)

  //save the data in a excel file
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(total);
  await XLSX.utils.book_append_sheet(wb, ws, "Indicador1");

  


  
  client.close();

  return wb

  
}

import fs from 'fs'

export default async  function handler(req, res) {

  if(req.method === 'GET'){

    const {indicador,fechaI,fechaF} = req.query;

    console.log(indicador,fechaI);

    const fecha1 = new Date(fechaI);
    const fecha2 = new Date(fechaF);







    const wb = await Indicador1(fecha1.getTime(),fecha2.getTime());

    //send wb as xlsx file to the client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Indicador1.xlsx');
    res.end(XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }));





    


  }


}
