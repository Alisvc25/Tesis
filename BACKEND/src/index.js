import app from './server.js'
import connection from './database.js'
import http from 'http'
import { Server } from 'socket.io'

// Conectar a la base de datos
connection()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,

    }
})

io.on('connection', (socket) => {
    console.log('Usuario conectado', socket.id)
    socket.on('enviar-mensaje-front-back', (payload) => {
        socket.broadcast.emit('enviar-mensaje-front-back', payload)
    })
})

const PORT = app.get('port');

server.listen(PORT, () => {
    console.log(`Servidor corriendo en :${PORT}`);
});

