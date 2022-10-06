const express = require('express');
const app = express();
const server = require('http').createServer(app);
const coors = require('cors');

const port = 3002;

app.use(coors());

//Aqui se ingresan el schudel de las tareas

app.get('/', (req, res) => {
    res.send('not foundd');
});

server.listen(port,()=>{
    console.log('server is running on port', port);
})




