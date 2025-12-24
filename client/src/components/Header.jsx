import { AppContent } from '../context/AppContext'
import { useContext, useState } from "react";

function Header() {
    const { userData } = useContext(AppContent);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100 text-center">
      <h2 className="text-4xl font-bold mb-4" >
        Welcome to the Auth App, <span className='text-blue-600'>{userData ? userData.name : 'Developer!' }</span>
      </h2>
      <p className="text-gray-700 text-lg">
        Secure authentication made simple
      </p>
    </div>
  );
}

export default Header;
