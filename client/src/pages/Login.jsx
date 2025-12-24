import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContent);

  const onSubmitHandler = async (e) => {
    try{
        e.preventDefault();

        axios.defaults.withCredentials = true;

        if(state === 'Sign Up'){
            const {data} = await axios.post(backendURL + '/api/auth/register',  {name, email, password});

            if(data.success){
                setIsLoggedIn(true);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } else{
            const {data} = await axios.post(backendURL + '/api/auth/login',  {email, password});

            if(data.success){
                setIsLoggedIn(true);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }

        }
    } catch(e) {
        toast.error(e.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {state === "Sign Up" ? "Create your account" : "Login to your account"}
        </h1>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {state === "Login" && (
            <p
              className="text-sm text-right text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {state}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Login")}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Sign Up")}
              >
                Sign up here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
