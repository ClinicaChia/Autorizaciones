//create a express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin: '*'}});
const cors = require('cors');


const port = 3001;

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        
        console.log('user disconnected');
    });
});




app.get('/', (req, res) => {
    res.send('Hello World!');
});

//initialize a simple http server
server.listen(port, () => {
  console.log('server is running on port', port);
});