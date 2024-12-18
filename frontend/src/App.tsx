
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'
import axios from 'axios'
// import { useState } from 'react'?
function App() {
  const [token ,settoken]=useState<string>(" ")


  return (
    <>
      <input placeholder="opt"></input>
      <input placeholder=" new password"></input>
      <Turnstile onSuccess={(token)=>{
        settoken(token) 
      }} siteKey='this is something that is generated from the cloudfare'> </Turnstile>
       <button onClick={() => {
        axios.post("http://localhost:3000/reset-password", {
          email: "test@gmail.com",
          otp: "123456",
          token: token,
        })
      }}>Update password</button>
     </>
  )
}

export default App
