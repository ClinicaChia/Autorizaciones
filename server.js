const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' })
dotenv.config()

const setFinalDay = async () => {
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

    

    total.push({Autorizador: autorizadores[index], total: temp , porcentaje: (temp/len)*100 , fecha : `${D1.getDate()}/${D1.getMonth()+1}/${D1.getFullYear()}`, TimeStap: D1.getTime(), perfil: item})


  })



  await collectionAut.insertMany(total)

  //await collection.insertMany()

} // para almacenar los datos de los indicadores en la base de datos

const rule = new schedule.RecurrenceRule();

rule.hour = 23;
rule.minute = 50;

schedule.scheduleJob(rule, function(){
  console.log('Creacion completa de los indicadores diarios a las 23:50 el dia ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}');
  setFinalDay();
});





const dev = false
const hostname = 'localhost'
const port = process.env.HOST_PORT
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    
    
  })
})