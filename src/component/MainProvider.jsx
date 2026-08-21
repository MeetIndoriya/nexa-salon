import React, { useState } from 'react'
import MainContext from './MainContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Registration from '../pages/Registration'
import Main from './Main'
import AdminDashboard from '../pages/AdminDashboard'
import UserDashboard from '../pages/UserDashboard'
import LayoutDashboard from '../pages/LayoutDashboard'
import ReceptionistDashboard from '../pages/ReceptionistDashboard'
import BarberDashboard from '../pages/BarberDashboard'

export default function MainProvider() {
    const [loginData, setLoginData] = useState({ email: "", password: "" })
    const [registrationData, setRegistrationData] = useState([{ fullname: "", email: "", phoneNumber: 0, password: "", comfirmPassword: "" }])
    const [isLogin, setIsLogin] = useState(false);
    const [mode, setMode] = useState('light');

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <MainContext.Provider value={{ loginData, setLoginData, registrationData, setRegistrationData, isLogin, setIsLogin, mode, toggleColorMode }}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path='/dashboard' element={<LayoutDashboard />}>
                        <Route path='admin' element={<AdminDashboard />} />
                        <Route path='reception' element={<ReceptionistDashboard />} />
                        <Route path='barber' element={<BarberDashboard />} />
                        <Route path='user' element={<UserDashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </MainContext.Provider>
    )
}
