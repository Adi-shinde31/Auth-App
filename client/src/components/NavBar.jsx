import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { useContext } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

function NavBar () {
    const navigate = useNavigate();
    const { userData, backendURL, setIsLoggedIn, setUserData } = useContext(AppContent);

    const sendVerificationOTP = async () => {
        console.log("🔵 Clicked Verify Email");
        try{
            console.log("🟡 Before API call");
            console.log("🧪 Final URL:", backendURL + '/api/auth/send-verify-otp');

            const promise = axios.post(
                    backendURL + '/api/auth/send-verify-otp',
                    {},
                    { withCredentials: true }
                );
            console.log("🧪 Axios promise created:", promise);
            const { data } = await promise;
            console.log("🧪 Axios promise created data :", data);
            console.log("🧪 Axios promise created data success:", data.success);
            if(data.success){
                console.log("🟡 Navigating to /email-verify");
                navigate('/email-verify');
                toast.success(data.message);
            } else{
                console.log("🔴 OTP API failed");
                toast.error(data.message);    
            }
        } catch (e) {
            console.error("🔴 Verify Email Error:", e);
            console.error("🔴 Error response:", e?.response?.data);
            console.log("❌ OTP API error:", e);
            toast.error(e.message);
        }
    }
    const logout = async () => {
        try{
            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendURL + '/api/auth/logout');
            data.success && setIsLoggedIn(false);
            data.success && setUserData(false);
            navigate('/');
        }catch (e){
            toast.error(e.message);
        }
    }
    return (
        <div className="w-full flex justify-between items-center px-6 sm:px-24 py-4 absolute top-0 z-50">
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold" onClick={() => navigate('/')}>
            Auth<span className="text-blue-600">App</span>
        </h1>

        {userData ? (
            <div className="relative group pt-3">
            {/* Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold cursor-pointer select-none">
                {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 top-full w-44 bg-white rounded-lg shadow-lg border opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150">
                <ul className="py-2 text-sm text-gray-700">
                    {!userData.isAccountVerified && (
                        <li onClick={sendVerificationOTP} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Verify Email
                        </li>
                    )}

                    <li
                        onClick={logout}
                        className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                        Logout
                    </li>
                </ul>
            </div>
            </div>
        ) : (
            <button
            onClick={() => navigate("/login")}
            type="button"
            className="px-6 py-2 rounded-full bg-blue-600 border border-gray-300 text-white hover:bg-black hover:text-gray-100 transition font-medium cursor-pointer"
            >
            Login
            </button>
        )}
        </div>

    )
}

export default NavBar;