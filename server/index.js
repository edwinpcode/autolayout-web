import express from 'express'
import http from 'http'
import cors from 'cors'
import * as socketio from 'socket.io'
const port = 4001

const app = express()

app.use(cors())
app.use(express.json())

const httpServer = http.createServer(app)
const server = new socketio.Server(httpServer, {
  cors: {
    origin: '*',
  },
})

server.on('connection', (socket) => {
  console.log('connected1')
  app.post('/setdashboardvalue', function async(req, res) {
    try {
      var dataBox = req.body
      socket.emit('message', dataBox.content)
      res.status(200).json({ msg: 'data berhasil masuk' })
    } catch (error) {
      console.log(error.message)
    }
  })
})

httpServer.listen(port)
