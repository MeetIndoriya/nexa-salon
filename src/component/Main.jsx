import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header';
import Footer from './Footer';
import { getAllProducts } from '../../backend/services/productService'
import { getAllServices } from '../../backend/services/serviceService'
import MainContext from './MainContext';
import { Box, useTheme, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';

export default function Main() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([])
    const [services, setServices] = useState([])
    const { mode } = useContext(MainContext);
    
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                              primary: { main: '#198754' },
                              background: { default: '#ffffff', paper: '#f8f9fa' },
                              text: { primary: '#212529', secondary: '#6c757d' },
                          }
                        : {
                              primary: { main: '#198754' },
                              background: { default: '#121212', paper: '#1e1e1e' },
                              text: { primary: '#ffffff', secondary: '#aaaaaa' },
                          }),
                },
            }),
        [mode]
    );


    useEffect(() => {
        const fetchData = async () => {
            const serviceResponse = await getAllServices()
            setServices(serviceResponse)
            const ProductResponse = await getAllProducts()
            setProducts(ProductResponse)
        }
        fetchData();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', width: '100%' }}>
                <Header />
            <div className="container my-5" data-bs-spy="scroll" >
                <div className="row g-4 align-items-center" >
                    <div className="col-12 col-lg-6 text-center text-lg-start" id="home">
                        <p className='text-success fw-bold' style={{ fontSize: "15px", letterSpacing: "1px" }}>
                            PREMIUM SALON EXPERIENCE
                        </p>
                        <h1 style={{ fontFamily: "Roboto", letterSpacing: "2px", fontSize: "4rem", color: theme.palette.text.primary }} className='fw-bold mb-3'>
                            Elevate Your <br />
                            <i className='text-success '>Essence</i>
                        </h1>
                        <p className='mb-4 mx-auto mx-lg-0' style={{ maxWidth: "500px", color: theme.palette.text.secondary }}>
                            Experience unparalleled grooming and styling in an atmosphere of refined luxury. Where master craftsmanship meets modern elegance.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2">
                            <button onClick={() => navigate('/login')}
                                id="btn-login"
                                className={`btn ${mode === 'dark' ? 'btn-outline-light' : 'btn-light border'} text-success rounded-5 shadow-sm fw-bold px-4 py-2`}>
                                Login
                            </button>
                            <button onClick={() => navigate('/login')}
                                className='btn btn-success rounded-5 shadow-sm fw-bold px-4 py-2'>
                                Book Now
                            </button>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <Box className="row g-3 shadow-lg p-4 rounded-5 align-items-center" sx={{ bgcolor: 'background.paper' }}>
                            <div className="col-6">
                                <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=60"
                                    alt="Nexa Salon"
                                    className='img-fluid shadow-lg rounded-5 w-100 object-fit-cover'
                                    style={{ height: "100%", maxHeight: "450px" }} />
                            </div>

                            <div className="col-6 d-flex flex-column gap-3">
                                <img src="https://plus.unsplash.com/premium_photo-1661380558859-40df8dd91dfd?w=600&auto=format&fit=crop&q=60"
                                    alt="Nexa Salon"
                                    className='img-fluid shadow-sm rounded-4 w-100'
                                    style={{ height: "auto", maxHeight: "215px" }} />
                                <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=60" alt="Nexa Salon"
                                    className='img-fluid shadow-sm rounded-4 w-100'
                                    style={{ height: "auto", maxHeight: "215px" }} />
                            </div>
                        </Box >
                    </div>
                </div>
            </div>

            <section id="services" className="container mt-5">
                <div className="text-center mb-5">
                    <p className="text-success fw-bold mb-1" style={{ fontSize: "15px", letterSpacing: "1px" }}>
                        OUR EXPERTISE
                    </p>
                    <h1 className="fw-bold" style={{ letterSpacing: "1px", fontSize: "2.5rem", color: theme.palette.text.primary }}>
                        Curated Services
                    </h1>
                </div>
                <div className="row g-4 overflow-hidden">
                    {services.map((svc) => (
                        <div key={svc._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <Box className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                                <div className="position-relative">
                                    <img src={svc.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} alt={svc.name} />
                                    <span className="position-absolute top-0 end-0 m-3 badge bg-white bg-opacity-75 text-dark rounded-pill px-3 py-1 shadow-sm fw-semibold">${svc.price}</span>
                                </div>
                                <div className="card-body d-flex flex-column p-4">
                                    <small className="mb-2 d-flex align-items-center gap-1" style={{ color: theme.palette.text.secondary }}>
                                        <i className="bi bi-clock"></i> {svc.duration}
                                    </small>
                                    <h5 className="card-title fw-bold mb-2" style={{ color: theme.palette.text.primary }}>{svc.name}</h5>
                                    <p className="card-text flex-grow-1 small mb-4" style={{ color: theme.palette.text.secondary }}>{svc.description}</p>
                                    <button className="btn btn-success w-100 rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2">
                                        Book <i className="bi bi-journal-bookmark"></i>
                                    </button>
                                </div>
                            </Box>
                        </div>
                    ))}
                </div>
            </section>

            <section id="products">
                <div className="container mt-5 overflow-hidden">
                    <div className="text-center mb-5">
                        <p className="text-success fw-bold mb-1" style={{ fontSize: "15px", letterSpacing: "1px" }}>
                            PROFESSIONAL CARE
                        </p>
                        <h1 className="fw-bold" style={{ letterSpacing: "1px", fontSize: "2.5rem", color: theme.palette.text.primary }}>
                            Premium Products
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row g-4 overflow-hidden justify-content-center">
                        {products.map((prod) => (
                            <div key={prod._id} className="col-12 col-md-6 col-lg-4">
                                <Box className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                                    <img
                                        src={prod.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'}
                                        className="card-img-top"
                                        style={{ height: '220px', objectFit: 'cover' }}
                                        alt={prod.name} />
                                    <div className="card-body d-flex flex-column p-4">
                                        <h5 className="card-title fw-bold mb-1" style={{ color: theme.palette.text.primary }}>{prod.name}</h5>
                                        <p className="card-text flex-grow-1 small mb-4" style={{ color: theme.palette.text.secondary }}>{prod.description}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <span className="fw-bold text-success fs-5">${prod.price}</span>
                                            <button className="btn btn-success rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2">
                                                Add to Cart <i className="bi bi-cart3"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
            </Box>
        </ThemeProvider>
    )
}
