import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import BASE_URL from "../../config/baseUrl";

function Analysis() {
    const navigate=useNavigate();
    const {id}= useParams();
    const [allAnalysis, setAllAnalysis]=useState([]);
    

    /////////////////////
    useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/traffic/analysis`, {token: cookie, ip: id})
          .then(res=>{
            console.log(res.data)
          setAllAnalysis(res.data);
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
  return (
    <PageLayoutAdmin>
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Visit Time</th>
          <th>Link</th>
          <th>Stay time</th>
        </tr>
      </thead>
      <tbody>
     
      {allAnalysis?.map((item, index)=>{
            return(
        <tr key={index}>
          <td>{item.time}</td>
          <td>{item.url}
            </td>
          <td>{item.count}sec</td>
        </tr>
            )
        })}
       
      </tbody>
    </table>

  </PageLayoutAdmin>
  )
}

export default Analysis