import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../config/baseUrl";

function AdminDashboard() {
  const navigate=useNavigate();
  const [dashboardData, setDashboardData]=useState([]);

      /////////////////////
      useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/admin/dashboard`, {token: cookie})
          .then(res=>{
            console.log(res.data)
          setDashboardData(res.data);
          })
          .catch(err=>{
            console.log(err);
            //Cookies.remove('AdminToken');
          })
        }
        else{
       //navigate('/admin')
        };
    },[navigate]);


  return (
    <PageLayoutAdmin>
  <section className="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>All User</h3>
            <p>{dashboardData?.users}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Resumes</h3>
            <p>{dashboardData?.resumes}</p>
          </div>
          <div className="dashboard-card">
            <h3>Support message pending</h3>

            {dashboardData?.support>0?
            <p className="sf-indicator" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {dashboardData?.support}<span className="status-dot status-red"></span>
                </p>:
            <p>{dashboardData?.support}</p>}
            
               

          </div>
        </div>
      </section>
    </PageLayoutAdmin>
  )
}

export default AdminDashboard