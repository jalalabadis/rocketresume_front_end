import React, { useEffect, useState } from 'react'
import PageLayoutAdmin from '../../layouts/PageLayoutAdmin'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from "../../config/baseUrl";
import ResumePreview from './../../components/ResumePreview';


function AllResumes() {
    const navigate=useNavigate();
    const [allResumeData, setAllResumeData]=useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const location = useLocation();
    

    /////////////////////
    useEffect(()=>{
        const cookie = Cookies.get('AdminToken');
        if (cookie) { 
          axios.post(`${BASE_URL}/admin/all-resumes`, {token: cookie})
          .then(res=>{
            console.log(res.data)
          setAllResumeData(res.data);
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
          <th>User</th>
          <th>Complete Step</th>
          <th>Progress</th>
          <th>Resume</th>
        </tr>
      </thead>
      <tbody>
        {allResumeData?.map((item, index)=>{
            return(
<tr key={index}>
          <td>{formatWallet(item._id)}</td>
          <td>{item.userId?.email}</td>
          <td>{item.completedSteps}</td>
          <td>
  {item.progressPercentage >= 100 ? (
    <svg viewBox="0 0 100 100" width="24" height="24">
      <g fill="none" stroke="black" strokeWidth="5">
        <circle cx="50" cy="50" r="45" stroke="green" fill="none" />
        <path d="M20,50 L40,70 L80,30" stroke="green" strokeWidth="5" fill="none" />
      </g>
    </svg>
  ) : (
    <div style={{ width: "100%",  borderRadius: "5px", padding: "3px" }}>
  <progress 
    value={item.progressPercentage} 
    max="100" 
    style={{
      width: "100%", 
      height: "10px",
      appearance: "none",
    }}
  ></progress>
</div>

  )}
</td>

<td> <button  onClick={() => {
                        setSelectedResume(item);
                        setShowPreviewModal(true);
                      }}>Resume Preview</button> </td>

        </tr>
            )
        })}
        
       
      </tbody>
    </table>




    {/* Resume Preview Modal */}
    {showPreviewModal && selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  pt-24">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Resume Preview
                  </h2>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[70vh]">
                  <ResumePreview data={selectedResume} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <div className="mt-6 flex justify-end space-x-3">
                  
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

  </PageLayoutAdmin>
  )
}

export default AllResumes