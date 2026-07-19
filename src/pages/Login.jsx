import React, { useContext } from 'react'
import MainContext from '../component/MainContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const { loginData, setLoginData } = useContext(MainContext)
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        if (loginData.username === 'meetindoriya5@gmail.com' && loginData.password === "Meet@1112") {
            alert(`User is Login `);
            navigate('/')
        }
        else {
            const validateMessage = document.querySelector('#validation')
            validateMessage.innerText = 'Enter Valid Username and Password'
        }
    }
    return (
        <>
            <div className="container">
                <div className="row d-flex justify-content-center vh-100 vw-auto align-items-center">
                    <div className="col-12 col-sm-12 col-md-8 col-xl-6 shadow-lg px-4 pt-5 pb-3 border border rounded-5 position-relative">
                        <h1 className='fw-bold fs-1 text-dark my-2 px-2'> Welcome back </h1>
                        <p className='text-muted px-3'> Enter your details to access your account</p>
                        <form onSubmit={handleChange}>
                            <div class="form-group my-3 mt-5">
                                <input type="email"
                                    class="form-control py-3 rounded-3"
                                    aria-describedby="emailHelp"
                                    placeholder='Email Address'
                                    name='email'
                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                    required />
                            </div>
                            <div class="form-group my-3">
                                <input type="password"
                                    class="form-control py-3 rounded-3"
                                    placeholder='Password'
                                    name='password'
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required />
                                <small class="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>

                            <div className="d-flex justify-content-center">
                                <span id="validation" className='text-danger bg bg shadow-sm px-2 py-1 rounded-3'></span>
                            </div>

                            <div class="form-group form-check d-flex justify-content-start">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                <label class="form-check-label ms-2" for="exampleCheck1">Remender me</label>
                                <a href="#" className='text-success ms-auto text-end text-decoration-none'> Forget Password ?</a>
                            </div>

                            <div className="d-flex justify-content-center my-4">
                                <button type="submit" class="btn btn-success text-center rounded-3 w-100 fs-5 ">Login
                                </button>
                            </div>

                            <div className="d-flex justify-content-center">
                                <button className='btn btn-transparent shadow-lg w-50 p-2 m-2 rounded-3'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                                </svg>
                                </button>
                                <button className='btn btn-transparent shadow-lg w-50 p-2 m-2 rounded-3'> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                </svg>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center m-3">
                                <p> Don't have an account ? </p>
                                <a href="" className='fw-bold text-center text-success text-decoration-none ms-2'
                                    onClick={() => navigate('/registration')}> Create One</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
