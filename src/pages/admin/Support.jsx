import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import BASE_URL from "../../config/baseUrl";

function Support() {
    const navigate=useNavigate();
    const [allLiveChat, setAllLiveChat]=useState([]);
    

    /////////////////////
    useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/chat/all`, {token: cookie})
          .then(res=>{
            console.log(res.data)
          setAllLiveChat(res.data);
          })
          .catch(err=>{
            console.log(err);
            //Cookies.remove('AdminToken');
          })
        }
        else{
       navigate('/admin')
        };
    },[navigate]);


   const handelChatMark=(_id)=>{
    axios.post(`${BASE_URL}/chat/mark`, {_id})
    .then(res=>{
      console.log(res.data)
      setAllLiveChat(prevChats =>
        prevChats.map(chat =>
            chat._id === _id ? { ...chat, status: true } : chat
        )
    );
    })
    .catch(err=>{
      console.log(err);
      //Cookies.remove('AdminToken');
    })
   
   };

  return (
    <PageLayoutAdmin>
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Email</th>
          <th>Message</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
     
      {allLiveChat?.map((item, index)=>{
            return(
        <tr key={index}>
          <td>   
            {!item.status&&<div style={{position: 'relative'}}>
              <p className="sf-indicator" style={{position: 'absolute', left: '-8px', top: '0'}}>
                <span className="status-dot status-red"></span>
              </p>

            </div>}
            {item.time}</td>
          <td>{item.email}
            </td>
            <td>{item.message}</td>
          <td>{item.status?
            <button
            style={{background: "green", color: "white", padding: "5px 12px", borderRadius: '8px'}} >Complete</button>
            :<button  onClick={()=>handelChatMark(item._id)}
          style={{background: "blue", color: "white", padding: "5px 12px", borderRadius: '8px'}} >Mark Complete</button>}</td>
        </tr>
            )
        })}
       
      </tbody>
    </table>

  </PageLayoutAdmin>
  )
}

export default Support