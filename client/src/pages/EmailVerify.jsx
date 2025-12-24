import { AppContent } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmailVerify () {
    console.log("📘 EmailVerify component MOUNTED");
    const inputRefs = useRef([]);
    const { backendURL, isLoggedIn, userData, getUserData } = useContext(AppContent);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

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

    const onSubmitHandler = async(e) => {
        try{
            e.preventDefault();
            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');

            const {data} = await axios.post(backendURL + '/api/auth/verify-account', {otp});

            if(data.success){
                toast.success(data.message);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);    
            }
        } catch(e) {
            toast.error(e.message);
        }
    }

    // auth guard
    useEffect(() => {
    console.log("🧠 useEffect1 fired in EmailVerify");
    console.log("1isLoggedIn:", isLoggedIn);
    console.log("1userData:", userData);
    if (!isLoggedIn) {
        console.log("🚨 Redirecting to home1 because already verified");
        navigate('/login');
    }
    }, [isLoggedIn]);

    // redirect after verification
    useEffect(() => {
        console.log("🧠 useEffect2 fired in EmailVerify");
        console.log("2isLoggedIn:", isLoggedIn);
        console.log("2userData:", userData);
    if (userData?.isAccountVerified) {
        console.log("🚨 Redirecting to home2 because already verified");
        navigate('/');
    }
    }, [userData]);
    return (
        <>
        {/* Navbar */}
        <div className="w-full flex justify-between items-center px-6 sm:px-24 py-4 absolute top-0 z-50">
            <h1 className="text-3xl font-bold">
            Auth<span className="text-blue-600">App</span>
            </h1>
        </div>

        {/* OTP Container */}
        <div className="min-h-screen flex items-center justify-center bg-sky-100 px-4">
            <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center"
            >
            <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
            <p className="text-gray-600 text-sm mb-6">
                Enter the 6-digit code sent to your email address
            </p>

            {/* OTP Inputs */}
            <div
                onPaste={handlePaste}
                className="flex justify-center gap-3 mb-6"
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
                Verify Email
            </button>
            </form>
        </div>
        </>
    )
}

export default EmailVerify;