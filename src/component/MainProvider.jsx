import React, { useState } from 'react'
import MainContext from './MainContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Login from '../pages/Login'
import Registration from '../pages/Registration'

export default function MainProvider() {
    const [loginData, setLoginData] = useState({ username: "", password: "" })
    const [registrationData, setRegistrationData] = useState([{ fullname: "", email: "", phoneNumber: 0, password: "", comfirmPassword: "" }])
    return (
        <MainContext.Provider value={{ loginData, setLoginData, registrationData, setRegistrationData }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />

                </Routes>
            </BrowserRouter>
        </MainContext.Provider>
    )
}
