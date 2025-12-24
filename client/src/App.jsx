import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login.jsx'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/email-verify' element={<EmailVerify />}/>
          <Route path='/reset-password' element={<ResetPassword />}/>

      </Routes>
    </>
  )
}

export default App