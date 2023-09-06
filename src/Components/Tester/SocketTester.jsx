import { useEffect, useState } from 'react'
import socket from '../../Utils/SocketUtils'

function SocketTester() {
  const [data, setData] = useState('')
  useEffect(() => {
    // socket.emit('getDashboard', 'awal')
    // socket.on('setDashboard', (data) => {
    //   console.log('setDashboard', data)
    //   setData(data)
    // })
  }, [])
  return <h3>test socket {data}</h3>
}

export default SocketTester
