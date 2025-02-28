import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from "../../config/baseUrl";


function AllUser() {
    const navigate=useNavigate();
    const [allUserData, setAllUserData]=useState([]);
    const [editUserDataModel, setEditUserDataModel]=useState();
    const location = useLocation();
    

    /////////////////////
    useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/admin/all-user`, {token: cookie})
          .then(res=>{
            console.log(res.data)
          setAllUserData(res.data);
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





// Function to format the wallet
const formatWallet = (wallet) => {
  if (!wallet) return '';
  return `${wallet.slice(0, 5)}......${wallet.slice(-3)}`;
};





  return (
    <PageLayoutAdmin>
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {allUserData?.map((item, index)=>{
            return(
<tr key={index}>
          <td>{formatWallet(item._id)}</td>
          <td>{item.email}
            {/* {item.password} */}
            </td>
          <td>{item.role}</td>
        </tr>
            )
        })}
        
       
      </tbody>
    </table>

  </PageLayoutAdmin>
  )
}

export default AllUser