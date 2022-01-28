import React, { useEffect, useState } from 'react'

import { io } from 'socket.io-client'


const Chat = () => {
  const [activity, setActivity] = useState([])
  const [clicks, setClicks] = useState(0)
  const [socket, setSocket] = useState()

  useEffect(() => {
    if (!socket) setSocket(io(process.env.REACT_APP_API_URL))

    socket && socket.on('click', clicks => setClicks(clicks))

    socket && socket.on('join', (data) => setActivity((prevActivity) => [...prevActivity, data]))
  }, [socket])

  useEffect(() => {
    socket && socket.emit('click', clicks)
  }, [socket, clicks])

  return(
    <div className='my-4 text-center'>
      <h5>Socket Activity:</h5>
      {activity.map((d, i) => <div key={i}>{d}</div>)}

      <button 
        onClick={() => setClicks(clicks + 1)}
        style={{ 
            marginTop: '1rem',
            backgroundColor: 'red' 
          }}>
          Hello! Clicked {clicks} times
      </button>
    </div>
  )
}

export default Chat
