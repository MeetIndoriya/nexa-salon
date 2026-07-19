import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {

    const navigate = useNavigate()
    return (
        <>
            <div className="contaienr">
                <div className="row">
                    <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                        <h1>Nexa <span> Salon</span></h1>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                        <h1> Navbar</h1>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                        <button onClick={() => navigate('/login')}> Login</button>
                        <button> Book</button>
                    </div>
                </div>
            </div>
        </>
    )
}
