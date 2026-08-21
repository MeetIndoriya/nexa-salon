import React, { useContext, useState } from 'react'
import MainContext from '../component/MainContext'
import { useNavigate, Link } from 'react-router-dom'
import { loginService } from '../../backend/services/authService'

export default function Login() {
    const { loginData, setLoginData, setIsLogin } = useContext(MainContext)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const response = await loginService(loginData)
        setIsLogin(true)

        const userRole = response.user.role
        localStorage.setItem('token', response.token)
        localStorage.setItem('User Role', response.user.role)

        if (userRole === 'Admin') {
            navigate('/dashboard/admin')
        } else if (userRole === 'Barber') {
            navigate('/dashboard/barber')
        } else if (userRole === 'Receptionist') {
            navigate('/dashboard/reception')
        } else if (userRole === 'Customer') {
            navigate('/dashboard/user')
        } else {
            setError('Invalid Credentials')
        }
    }


    return (
        <>
            <div className="container">
                <div className="row d-flex justify-content-center vh-100 vw-auto align-items-center">
                    <div className="col-12 col-sm-12 col-md-8 col-xl-6 shadow-lg px-4 pt-5 pb-3 border border rounded-5 position-relative">
                        <h1 className='fw-bold fs-1 text-dark my-2 px-2'> Welcome back </h1>
                        <p className='text-muted px-3'> Enter your details to access your account</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group my-3 mt-5">
                                <input type="email"
                                    className="form-control py-3 rounded-3"
                                    aria-describedby="emailHelp"
                                    placeholder='Email Address'
                                    name='email'
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required />
                            </div>
                            <div className="form-group my-3">
                                <input type="password"
                                    className="form-control py-3 rounded-3"
                                    placeholder='Password'
                                    name='password'
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required />
                                <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>


                            <div className="d-flex justify-content-center">
                                <span className='text-danger bg bg shadow-sm px-2 py-1 rounded-3'>
                                    {error}
                                </span>
                            </div>

                            <div className="form-group form-check d-flex justify-content-start">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label className="form-check-label ms-2" htmlFor="exampleCheck1">Remender me</label>
                                <Link to="#" className='text-success ms-auto text-end text-decoration-none'> Forget Password ?</Link>
                            </div>

                            <div className="d-flex justify-content-center my-4 gap-3">
                                <button id='btn-login' type="submit" className="btn btn-success text-light text-center rounded-3 w-100 fs-5 shadow-lg">Login</button>
                                <button type="reset" className="btn btn-secondary text-light text-center rounded-3 w-100 fs-5 shadow-lg "
                                    onClick={() => {
                                        setIsLogin(false)
                                        navigate('/')
                                    }}>Back To Home</button>

                            </div>

                            <div className="d-flex justify-content-center m-3">
                                <p> Don't have an account ? </p>
                                <Link to="/registration" className='fw-bold text-center text-success text-decoration-none ms-2'
                                > Create One</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}