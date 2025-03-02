import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import BASE_URL from "../../config/baseUrl";

function Traffic() {
    const navigate=useNavigate();
    const [allIpUser, setAllIpUser]=useState([]);
    const [editIpUserModel, setEditIpUserModel]=useState();
    const location = useLocation();
    

    /////////////////////
    useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/traffic/all-ip`, {token: cookie})
          .then(res=>{
            console.log(res.data)
          setAllIpUser(res.data);
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
          <th>IP</th>
          <th>Last Visit</th>
          <th>Analysis</th>
        </tr>
      </thead>
      <tbody>
     
      {allIpUser?.map((item, index)=>{
            return(
        <tr key={index}>
          <td>{item.ip}</td>
          <td>{item.active}
            {/* {item.password} */}
            </td>
          <td><Link  style={{background: "green", color: "white", padding: "5px 12px", borderRadius: '8px'}} to={`/admin/analysis/${item.ip}`}>Check analytics</Link></td>
        </tr>
            )
        })}
       
      </tbody>
    </table>

  </PageLayoutAdmin>
  )
}

export default Traffic