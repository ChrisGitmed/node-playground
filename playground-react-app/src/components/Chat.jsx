import React, { useEffect, useState } from 'react'

import { io } from 'socket.io-client'

const Chat = () => {
  const [activity, setActivity] = useState([])
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL)


    socket.on("FromAPI", data => {
      console.log('hello')
      setResponse(data);
    });

    socket.on("newActivity", (data) => {
      setActivity((prevActivity) => [...prevActivity, data])
    })

  }, [])

  return(
    <div className='my-4 text-center'>
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
      <h5>Socket Activity:</h5>
      {activity.map((d, i) => <div key={i}>{d}</div>)}
    </div>
  )
}

export default Chat
