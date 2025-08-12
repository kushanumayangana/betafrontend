import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const VerifyOtp = ()=>{
    const[otp,setOtp] = useState('');
    const [message,setMessage] = useState('');
    const [error,setError] = useState('');
    const [email,setEmail] = useState();

     const  navigate = useNavigate();

     useEffect (() => {
        const savedEmail = localStorage.getItem('emailForOtp');
        if (!savedEmail){
            navigate('/register');
        }else{
            setEmail(savedEmail);
        }
     },[navigate]);

     const handleVerify = async e => {
        e.preventDefault();
        setError('');
        setMessage('');

        try{
            const response = await axios.post('http://localhost:3001/api/user/verify-otp',{
                email,
                otp
            });
            setMessage('✅ OTP verified! Registration complete.');
            localStorage.removeItem('emailForOtp');
            setTimeout(()=> navigate('/login'),2000);
        }catch(error){
            if (error.response  && error.response.data) {
                setError(error.response.data.message || 'Verification failed');
            }else{
                setError('server error');
            };
        };

     }

   return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter the OTP sent to your email</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>

   );
};

export default VerifyOtp;