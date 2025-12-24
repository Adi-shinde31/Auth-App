import { AppContent } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword () {
    const navigate = useNavigate();
    const { backendURL } = useContext(AppContent);
    const [ email, setEmail ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    
    const [ isEmailSent, setIsEmailSent ] = useState(false);
    const [ otp, setOTP ] = useState(0);
    const [ isOTPSubmitted, setIsOTPSubmitted ] = useState(false);
    
    axios.defaults.withCredentials = true;

    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index]){
                inputRefs.current[index].value = char;
            }
        })
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(backendURL + '/api/auth/send-reset-otp', {email});
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && setIsEmailSent(true);
        } catch(e) {
            toast.error(e.message);
        }
    }

    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        setOTP(otpArray.join(''));
        setIsOTPSubmitted(true);
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(backendURL + '/api/auth/reset-password', {email,otp,newPassword});
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && navigate('/login');
        } catch(e) {
            toast.error(e.message);
        }
    }
    

    return (
        <>
            {/* Navbar */}
            <div className="w-full flex justify-between items-center px-6 sm:px-24 py-4 absolute top-0 z-50">
                <h1
                className="text-3xl font-bold cursor-pointer"
                onClick={() => navigate("/")}
                >
                Auth<span className="text-blue-600">App</span>
                </h1>
            </div>

            {/* Page Container */}
            <div className="min-h-screen flex items-center justify-center bg-sky-100 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

                {/* STEP 1 — EMAIL */}
                {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="space-y-4">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-600 text-sm">
                        Enter your registered email address
                    </p>

                    <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Send OTP
                    </button>
                    </form>
                )}

                {/* STEP 2 — OTP */}
                {!isOTPSubmitted && isEmailSent && (
                    <form onSubmit={onSubmitOTP} className="space-y-6">
                    <h1 className="text-2xl font-bold">Verify OTP</h1>
                    <p className="text-gray-600 text-sm">
                        Enter the 6-digit code sent to your email
                    </p>

                    <div
                        onPaste={handlePaste}
                        className="flex justify-center gap-3"
                    >
                        {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <input
                            key={index}
                            type="text"
                            maxLength="1"
                            required
                            ref={(e) => (inputRefs.current[index] = e)}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Verify OTP
                    </button>
                    </form>
                )}

                {/* STEP 3 — NEW PASSWORD */}
                {isOTPSubmitted && isEmailSent && (
                    <form onSubmit={onSubmitNewPassword} className="space-y-4">
                    <h1 className="text-2xl font-bold">Set New Password</h1>
                    <p className="text-gray-600 text-sm">
                        Enter your new password below
                    </p>

                    <input
                        type="password"
                        required
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Reset Password
                    </button>
                    </form>
                )}
                </div>
            </div>
        </>

    )
}

export default ResetPassword;