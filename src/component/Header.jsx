import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-scroll'
import MainContext from './MainContext'
import "../tailwind.css";
import { Box, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isLogin, setIsLogin, mode, toggleColorMode } = useContext(MainContext)
    const theme = useTheme()
    
    const isLandingPage = location.pathname === '/';

    return (
        <>
            <Box className="w-full shadow-lg sticky top-0 z-50 overflow-hidden" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                <div className="w-full">
                    <div className="w-full">
                        <nav className="flex items-center justify-between px-4 py-2">
                            <h2 id="hero-nexa" className="text-start ml-4 mt-1 p-0" style={{ color: theme.palette.text.primary }}> Nexa<span id="hero-salon"> Salon</span> </h2>
                            <button type="button"
                                className="lg:hidden rounded-5 border border-gray-300 p-2" aria-label="Toggle navigation">
                                <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
                                <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
                                <span className="block w-6 h-0.5 bg-gray-600"></span>
                            </button>

                            <div className="hidden lg:flex flex-1 items-center" id="navbarSupportedContent">
                                <ul className="flex mx-auto font-semibold text-lg">
                                    <li className="active">
                                        <Link
                                            to="home" spy={true} smooth={true} offset={-150}
                                            activeClass="active" className="cursor-pointer text-green-600 text-center mx-2">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="services" spy={true} smooth={true} offset={-100} activeClass="active"
                                            className="cursor-pointer text-green-600 text-center mx-2">
                                            Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="products" spy={true} smooth={true} offset={-100} activeClass="active"
                                            className="cursor-pointer text-green-600 text-center mx-2">
                                            Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="contact" spy={true} smooth={true} offset={-100} activeClass="active"
                                            className="cursor-pointer text-green-600 text-center mx-2">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>

                                <div className="flex flex-col lg:flex-row justify-center items-center my-2">
                                    {isLandingPage && (
                                        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
                                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                        </IconButton>
                                    )}
                                    <button
                                        onClick={() => {
                                            isLogin ? navigate('/') : navigate('/login')
                                            isLogin ? setIsLogin(false) : setIsLogin(true)
                                        }}
                                        className={`text-green-700 text-center rounded-2xl shadow-sm font-bold px-3 py-1 mx-2 my-1 lg:my-0 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`} > {isLogin ? "Logout" : "Login"}</button>
                                    <button onClick={() => navigate('/login')} className="bg-green-700 text-white text-center rounded-2xl shadow-sm border font-bold px-3 py-1 mx-2 my-1 lg:my-0">Book Now</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </Box>
        </>
    )
}