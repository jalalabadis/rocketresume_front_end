import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import BASE_URL from "../../config/baseUrl";

const Admin = () => {
  const navigate=useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(credentials.username&&credentials.password){
      axios.post(`${BASE_URL}/admin/login`, 
        {userName: credentials.username, pass: credentials.password})
      .then(res=>{
        if(res.data?.Status&&res.data?.token){
          Cookies.set('AdminToken', res.data.token);
          navigate('/admin/dashboard');
        }
        else{
          console.log(res.data)
          toast.error(res.data.Message);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
    else{
      toast.error("Fill all info");
    };
  };

  return (
    <div className="admin-hkj-login-container">
      <h1 className="admin-hkj-login-title">Admin Login</h1>
      <form className="admin-hkj-login-form" onSubmit={handleSubmit}>
        <div className="admin-hkj-login-input-group">
          <label htmlFor="username" className="admin-hkj-login-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="admin-hkj-login-input"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-hkj-login-input-group">
          <label htmlFor="password" className="admin-hkj-login-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="admin-hkj-login-input"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="admin-hkj-login-button">Login</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Admin;
