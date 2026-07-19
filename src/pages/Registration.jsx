import React, { useContext } from 'react'
import MainContext from '../component/MainContext'
import { useNavigate } from 'react-router-dom'

export default function Registration() {
    const { registrationData, setRegistrationData } = useContext(MainContext)
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        if (registrationData.password !== registrationData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert(`User is Registered\n\n ${registrationData}`);
        navigate('/login');
    }

    return (
        <>
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center vw-auto wh-auto">
                    <div className="col-12 col-sm-12 col-md-8 col-xl-6 shadow-lg px-4 py-3 border border rounded-5 mt-5 position-relative">
                        <h1 className='fw-bold fs-1 text-dark my-2 px-2 text-center'> Create Account </h1>
                        <p className='text-muted px-3 text-center'> Enter your details to join with <span className='text-success fs-5 fw-bold'>Nexa Salon</span></p>
                        <form onSubmit={handleChange}>

                            <div className="d-flex justify-content-center">
                                <div class="form-group my-3 col-12">
                                    <input type="text"
                                        class="form-control py-3 rounded-3"
                                        placeholder='Full Name'
                                        name='fullname'
                                        onChange={(e) => setRegistrationData({ ...registrationData, fullname: e.target.value })}
                                        required />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center gap-2">
                                <div class="form-group my-3 col-6">
                                    <input type="email"
                                        class="form-control py-3 rounded-3"
                                        aria-describedby="emailHelp"
                                        placeholder='Email Address'
                                        name='email'
                                        onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                                        required />
                                </div>

                                <div class="form-group my-3 col-6">
                                    <input type="tel"
                                        class="form-control py-3 rounded-3"
                                        placeholder='Phone Number'
                                        name='phoneNumber'
                                        onChange={(e) => setRegistrationData({ ...registrationData, phoneNumber: e.target.value })}
                                        required />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center gap-2">
                                <div class="form-group my-3 col-6">
                                    <input type="password"
                                        class="form-control py-3 rounded-3"
                                        aria-describedby="passwordHelpBlock"
                                        placeholder='Password'
                                        name='password'
                                        onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                                        required
                                    />

                                </div>

                                <div class="form-group my-3 col-6">
                                    <input type="password"
                                        class="form-control py-3 rounded-3"
                                        aria-describedby="passwordHelpBlock"
                                        placeholder='Confirm Password'
                                        name="comfirmPassword"
                                        onChange={(e) => setRegistrationData({ ...registrationData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div class="form-text ">
                                Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                            </div>

                            <div className="d-flex justify-content-center">
                                <span id="validation" className='text-danger bg bg shadow-sm px-2 py-1 rounded-3'></span>
                            </div>

                            <div className="d-flex justify-content-center my-4">
                                <button type="submit" class="btn btn-success text-center rounded-3 w-100 fs-5 fw-bold ">Register
                                </button>
                            </div>

                            <div className="d-flex justify-content-center m-3">
                                <p> Already have an account ? </p>
                                <a href="" className='fw-bold text-center text-success text-decoration-none ms-2'
                                    onClick={() => navigate('/login')}> Login</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
