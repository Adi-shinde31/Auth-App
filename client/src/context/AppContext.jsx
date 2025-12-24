import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    console.log("Verify URL:", backendURL);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ userData, setUserData ] = useState(null);

    const getAuthState = async () => {
        try{
            const { data } = await axios.get(backendURL + '/api/auth/is-auth', { withCredentials: true });

            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
            else{
                setIsLoggedIn(false);
            }
        } catch (e) {   
            if (e.response?.status !== 401) {
                toast.error(e.message);
            }
            setIsLoggedIn(false);
        }   
    }

    const getUserData = async () => {
        try{
            const {data} = await axios.get(backendURL + '/api/user/data', { withCredentials: true });
            data.success ? setUserData(data.userData) : toast.error(data.message); 
        } catch (e) {   
            toast.error(e.message); 
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}