//create a express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin: '*'}});
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })
dotenv.config()

const port = process.env.SOCKETS_PORT;

app.use(cors());

io.on('connection', (socket) => {
    

    socket.on('append', (data) => {
        socket.local.emit('append', data);
    })

    socket.on('validate', (data) => {
        
        socket.local.emit('validate', data);
    })

    socket.on('update', (data) => {
      
        socket.local.emit('update', data);
    })

    socket.on('changeState', (data) => {
      
        socket.local.emit('changeState', data);
    })

    socket.on('disconnect', () => {
        
      
    });

});




app.get('/', (req, res) => {
    res.send('Hello World!');
});

//initialize a simple http server
server.listen(port, () => {
  console.log('server is running on port', port);
});