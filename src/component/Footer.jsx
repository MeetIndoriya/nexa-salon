import React from 'react'
import { Link } from 'react-router-dom'
import { Box, useTheme } from '@mui/material';
export default function Footer() {
    const theme = useTheme();
    return (
        <Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
            <div className="container-fluid mt-4" id="contact">
                <div className="row">
                    <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
                        <div className="col mb-3"> <Link to="/" href="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none" aria-label="Bootstrap">
                            <svg className="bi me-2" width="40" height="32" aria-hidden="true">
                                <use xlinkHref="#bootstrap"></use>
                            </svg>
                        </Link>
                            <p style={{ color: theme.palette.text.secondary }}>&copy; 2025</p>
                        </div> <div className="col mb-3"></div>
                        <div className="col mb-3">
                            <h5 style={{ color: theme.palette.text.primary }}>Section</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Home</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Features</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Pricing</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>FAQs</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>About</Link></li>
                            </ul>
                        </div>
                        <div className="col mb-3">
                            <h5 style={{ color: theme.palette.text.primary }}>Section</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Home</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Features</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Pricing</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>FAQs</Link></li>
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>About</Link></li>
                            </ul> </div> <div className="col mb-3">
                            <h5 style={{ color: theme.palette.text.primary }}>Section</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Home</Link>
                                </li> <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Features</Link></li> <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>Pricing</Link></li> <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>FAQs</Link></li> <li className="nav-item mb-2"><Link to="#" href="#" className="nav-link p-0" style={{ color: theme.palette.text.secondary }}>About</Link></li> </ul> </div> </footer>
                </div>
            </div>
        </Box>
    )
}
