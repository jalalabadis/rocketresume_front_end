import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import BASE_URL from "../config/baseUrl";


function LiveChat() {
    const [step, setStep]=useState(1);
    const [message, setMessage]=useState('');
    const [email, setEmail]=useState('');

    const handelLiveChatSubmit=(e)=>{
        e.preventDefault();
        axios.post(`${BASE_URL}/chat/start`, {email, message})
        .then(res=>{
            console.log(res.data)
        setStep(3);
        })
        .catch(err=>{
            console.log(err);
            //Cookies.remove('AdminToken');
        })
    };
  return (
    <>
    <input type="checkbox" id="click"/>
      <label className='label-live-chat-hkj' htmlFor="click">
      <i className="chat-hkj-icon fas fa-comment-alt"></i>
      <i className="close-hkj-icon fas fa-times"></i>
      </label>
      <div className="wrapper">
         <div className="head-text">
            Let's chat
         </div>
       {step===1?
       
       <div className="chat-box">
            <form className='live-chat-form' style={{margin: 0, minHeight: '380px', display: 'flex', alignItems: 'flex-end', padding: "8px 8px"}}>
            
                 
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '12px', padding: '5px 10px', width: '100%', maxWidth: '400px' }}>
  {/* ইনপুট ফিল্ড */}
  <input 
    value={message}
    onChange={e=>setMessage(e.target.value)}
    type="text" 
    placeholder="Type a message..." 
    style={{ 
      flex: 1, 
      border: 'none', 
      outline: 'none', 
      fontSize: '14px', 
      padding: '8px' 
    }} 
  />

  {/* সেন্ড আইকন */}
  <button onClick={()=>{
    if(message!==""){
    setStep(2)}
    else{
     toast("Type Your message")
    }
    }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
  <i className="fas fa-paper-plane"></i> 
  </button>
</div>

            </form>
         </div>
       :
    step===2?
    <div className="chat-box">
            <div className="desc-text">
            Please provide your email address so we can send you a reply.
            </div>
            <form className='live-chat-form' onSubmit={handelLiveChatSubmit}>
            
               <div className="field">
                  <input value={email} onChange={e=>setEmail(e.target.value)}
                  type="email" placeholder="Email Address" required/>
               </div>
              
               <div className="field">
                  <button type="submit">Submit</button>
               </div>
            </form>
         </div>:
         <div className="chat-box" style={{ minHeight: '380px', display: 'flex', alignItems: 'center'}}>
         <div className="desc-text">
         Your message has been received! We will reply to your email shortly.
         </div>
      </div>
         }
      </div>

      <ToastContainer/>
      </>
  )
}

export default LiveChat