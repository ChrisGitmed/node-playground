import React, { useEffect, useState } from 'react'

import { io } from 'socket.io-client'

const Chat = () => {
  const [activity, setActivity] = useState(['hello'])

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL)

    socket.on('connect', () => {
      const connectMsg = `Socket id ${socket.id} connected`
      setActivity((prevActivity) => [...prevActivity, connectMsg])
    })

    socket.on('disconnect', () => {
      const disconnectMsg = `Socket id ${socket.id} disconnected`
      setActivity((prevActivity) => [...prevActivity, disconnectMsg])
    })
  }, [])

  return(
    <div className='my-4 text-center'>
      <h5>Socket Activity:</h5>
      {activity.map((d, i) => <div key={i}>{d}</div>)}
    </div>
  )
}

export default Chat
