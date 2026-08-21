import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomerDashboard } from '../../backend/services/authService'
import { getMyAppointment, createAppointment, cancelAppointment, getAvailableSlots } from '../../backend/services/appointmentService'
import { getAllProducts } from '../../backend/services/productService'
import { getAllServices } from '../../backend/services/serviceService'
import { getBarbers } from '../../backend/services/userService'
import { createOrder } from '../../backend/services/orderService'

export default function UserDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [myAppointments, setMyAppointments] = useState([])
    const [services, setServices] = useState([])
    const [products, setProducts] = useState([])
    const [barbers, setBarbers] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    const [showBookModal, setShowBookModal] = useState(false)
    const [bookingService, setBookingService] = useState('')
    const [bookingBarber, setBookingBarber] = useState('')
    const [bookingDate, setBookingDate] = useState('')
    const [bookingTimeSlot, setBookingTimeSlot] = useState('')
    const [bookingNotes, setBookingNotes] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [submittingBooking, setSubmittingBooking] = useState(false)

    const [showCancelModal, setShowCancelModal] = useState(false)
    const [cancellingAppId, setCancellingAppId] = useState(null)
    const [cancelReason, setCancelReason] = useState('')
    const [submittingCancel, setSubmittingCancel] = useState(false)

    const [showOrderModal, setShowOrderModal] = useState(false)
    const [orderingProduct, setOrderingProduct] = useState(null)
    const [orderQuantity, setOrderQuantity] = useState(1)
    const [orderAddress, setOrderAddress] = useState('')
    const [orderPhone, setOrderPhone] = useState('')
    const [submittingOrder, setSubmittingOrder] = useState(false)

    const token = localStorage.getItem('token')
    const checkRole = localStorage.getItem('User Role')

    const todayDateStr = new Date().toISOString().split('T')[0]

    const fetchData = async () => {
        setLoading(true)
        try {
            const CustomerResponse = await getCustomerDashboard()
            setDashboard(CustomerResponse)
            const AppointmentResponse = await getMyAppointment()
            setMyAppointments(AppointmentResponse || [])
            const serviceResponse = await getAllServices()
            setServices(serviceResponse || [])
            const ProductResponse = await getAllProducts()
            setProducts(ProductResponse || [])
            const barberResponse = await getBarbers()
            setBarbers(barberResponse?.data || barberResponse || [])
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token || (checkRole && checkRole !== 'Customer')) {
            if (!token) {
                navigate('/login')
                return
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchSlots = async () => {
            if (bookingBarber && bookingDate) {
                setLoadingSlots(true)
            const defaultSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(time => ({ time, available: true }))
            setAvailableSlots(defaultSlots)
            setLoadingSlots(false)
            }
            else {
                setAvailableSlots([])
            }
        }
        fetchSlots()
    }, [bookingBarber, bookingDate])

    const handleOpenBookModal = (preselectedServiceId = '') => {
        setBookingService(preselectedServiceId || (services.length > 0 ? services[0]._id : ''))
        setBookingBarber(barbers.length > 0 ? barbers[0]._id : '')
        setBookingDate(todayDateStr)
        setBookingTimeSlot('')
        setBookingNotes('')
        setShowBookModal(true)
    }

    const handleBookAppointment = async (e) => {
        e.preventDefault()
        if (!bookingService || !bookingBarber || !bookingDate || !bookingTimeSlot) {
            alert('Please select service, barber, appointment date, and time slot.')
            return
        }

        setSubmittingBooking(true)
        try {
            const payload = {
                service: bookingService,
                barber: bookingBarber,
                date: bookingDate,
                timeSlot: bookingTimeSlot,
                notes: bookingNotes
            }
            const res = await createAppointment(payload)
            const newApp = res.data || res

            // Update appointments list
            setMyAppointments(prev => [newApp, ...prev])

            // Update dashboard statistics
            if (dashboard) {
                setDashboard(prev => ({
                    ...prev,
                    upcomingAppointments: [...(prev.upcomingAppointments || []), newApp]
                }))
            }

            setShowBookModal(false)
            alert('🎉 Appointment booked successfully!')
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to book appointment')
        } finally {
            setSubmittingBooking(false)
        }
    }

    // Open cancellation modal
    const handleOpenCancelModal = (id) => {
        setCancellingAppId(id)
        setCancelReason('')
        setShowCancelModal(true)
    }

    // Confirm cancel appointment
    const handleConfirmCancel = async (e) => {
        e.preventDefault()
        if (!cancellingAppId) return

        setSubmittingCancel(true)
        try {
            await cancelAppointment(cancellingAppId, cancelReason)

            setMyAppointments(prev => prev.map(app =>
                app._id === cancellingAppId ? { ...app, status: 'Cancelled' } : app
            ))
            if (dashboard && dashboard.upcomingAppointments) {
                setDashboard(prev => ({
                    ...prev,
                    upcomingAppointments: prev.upcomingAppointments.filter(app => app._id !== cancellingAppId)
                }))
            }
            setShowCancelModal(false)
            alert('Appointment cancelled successfully.')
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to cancel appointment')
        } finally {
            setSubmittingCancel(false)
        }
    }

    // Open product order modal
    const handleOpenOrderModal = (product) => {
        setOrderingProduct(product)
        setOrderQuantity(1)
        setOrderAddress('')
        setOrderPhone('')
        setShowOrderModal(true)
    }

    // Place product order
    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        if (!orderingProduct) return

        setSubmittingOrder(true)
        try {
            const payload = {
                items: [
                    {
                        product: orderingProduct._id,
                        quantity: Number(orderQuantity) || 1
                    }
                ],
                shippingAddress: orderAddress,
                phone: orderPhone
            }
            const res = await createOrder(payload)
            const newOrder = res.data || res

            if (dashboard) {
                setDashboard(prev => ({
                    ...prev,
                    recentOrders: [newOrder, ...(prev.recentOrders || [])],
                    totalSpent: (prev.totalSpent || 0) + (orderingProduct.price * Number(orderQuantity))
                }))
            }

            setShowOrderModal(false)
            alert('🛍️ Order placed successfully!')
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to place order')
        } finally {
            setSubmittingOrder(false)
        }
    }

    if (loading) {
        return (
            <div className="container text-center my-5 py-5">
                <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading dashboard...</span>
                </div>
                <p className="mt-3 text-muted fw-semibold">Loading your personalized dashboard...</p>
            </div>
        )
    }

    const upcomingAppointmentCount = myAppointments.filter(a => a.status !== 'Cancelled' && a.status !== 'Completed').length
    const pastAppointmentCount = myAppointments.filter(a => a.status === 'Completed').length
    const totalSpentAmount = dashboard?.totalSpent || 0
    const recentOrdersList = dashboard?.recentOrders || []

    return (
        <div className="container py-4">

            {/* Header Banner */}
            <div className="bg-gradient bg-success text-white p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h2 className="fw-bold mb-1 text-white">Welcome Back to Nexa Salon!</h2>
                        <p className="mb-0 text-white-50">Manage your bookings, reserve top barbers, explore luxury treatments, and shop products.</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <button onClick={() => handleOpenBookModal()} className="btn btn-light text-success fw-bold rounded-pill px-4 shadow-sm">
                            + Book Appointment
                        </button>
                        <button onClick={() => navigate('/')} className="btn btn-outline-light fw-semibold rounded-pill px-4">
                            Explore Salon
                        </button>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3 text-success fs-3">
                                📅
                            </div>
                            <div>
                                <h6 className="card-subtitle text-muted mb-1">Active Bookings</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark">{upcomingAppointmentCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 text-primary fs-3">
                                ✔
                            </div>
                            <div>
                                <h6 className="card-subtitle text-muted mb-1">Completed Visits</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark">{pastAppointmentCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3 text-warning fs-3">
                                🛍
                            </div>
                            <div>
                                <h6 className="card-subtitle text-muted mb-1">Recent Orders</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark">{recentOrdersList.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3 text-info fs-3">
                                💳
                            </div>
                            <div>
                                <h6 className="card-subtitle text-muted mb-1">Total Spent</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark">${Number(totalSpentAmount).toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'overview' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('overview')}>
                        Overview & Appointments ({myAppointments.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'services' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('services')}>
                        Browse Services ({services.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'products' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('products')}>
                        Salon Products ({products.length})
                    </button>
                </li>
            </ul>

            {/* Tab: Overview & Appointments */}
            {activeTab === 'overview' && (
                <div className="row g-4">
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-0 text-dark">My Appointments</h5>
                                    <small className="text-muted">Track your scheduled salon sessions</small>
                                </div>
                                <button
                                    onClick={() => handleOpenBookModal()}
                                    className="btn btn-success btn-sm rounded-pill px-3 fw-semibold shadow-sm">
                                    + Book New
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Service</th>
                                            <th>Barber</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myAppointments.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">
                                                    You don't have any appointments booked yet. Click "+ Book New" to schedule one!
                                                </td>
                                            </tr>
                                        ) : (
                                            myAppointments.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        <div className="fw-bold">{item.date}</div>
                                                        <small className="text-muted">{item.timeSlot} {item.endTime ? ` - ${item.endTime}` : ''}</small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text-dark">{item.service?.name || 'Service'}</div>
                                                        {item.service?.price && <small className="text-success fw-bold">${item.service.price}</small>}
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text-dark">{item.barber?.name || 'Unassigned'}</div>
                                                        {item.barber?.specializations && (
                                                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '140px' }}>
                                                                {Array.isArray(item.barber.specializations) ? item.barber.specializations.join(', ') : item.barber.specializations}
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${
                                                            item.status === 'Completed' ? 'bg-success' :
                                                            item.status === 'Cancelled' ? 'bg-danger' :
                                                            item.status === 'In Progress' ? 'bg-info text-dark' :
                                                            item.status === 'Confirmed' ? 'bg-primary' :
                                                            'bg-warning text-dark'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        {item.status !== 'Cancelled' && item.status !== 'Completed' ? (
                                                            <button
                                                                onClick={() => handleOpenCancelModal(item._id)}
                                                                className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                                                Cancel
                                                            </button>
                                                        ) : (
                                                            <span className="text-muted small">
                                                                {item.status === 'Cancelled' ? 'Cancelled' : 'Completed'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        {/* Recent Orders */}
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-dark">Recent Orders</h5>
                                <span className="badge bg-light text-dark rounded-pill border">{recentOrdersList.length} Orders</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrdersList.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted small">
                                                    No product orders placed yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentOrdersList.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="fw-bold text-dark">${(Number(order.totalAmount || 0)).toFixed(2)}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${
                                                            order.status === 'Delivered' ? 'bg-success' :
                                                            order.status === 'Cancelled' ? 'bg-danger' :
                                                            order.status === 'Shipped' ? 'bg-primary' : 'bg-info text-dark'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recommended Services */}
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-dark">Recommended Services</h5>
                                <button onClick={() => setActiveTab('services')} className="btn btn-link btn-sm text-success text-decoration-none p-0 fw-semibold">
                                    View All →
                                </button>
                            </div>
                            <div className="list-group list-group-flush">
                                {services.slice(0, 4).map((svc) => (
                                    <div key={svc._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h6 className="fw-bold mb-0 text-dark">{svc.name}</h6>
                                            <small className="text-muted">{svc.category} • ⏱ {svc.duration} mins</small>
                                        </div>
                                        <div className="text-end">
                                            <span className="badge bg-success-subtle text-success fw-bold fs-6 d-block mb-1">
                                                ${svc.price}
                                            </span>
                                            <button
                                                onClick={() => handleOpenBookModal(svc._id)}
                                                className="btn btn-outline-success btn-sm rounded-pill px-3 py-0"
                                                style={{ fontSize: '0.75rem' }}>
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Browse Services */}
            {activeTab === 'services' && (
                <div className="row g-4">
                    {services.map((svc) => (
                        <div key={svc._id} className="col-12 col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                <img
                                    src={svc.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'}
                                    className="card-img-top"
                                    style={{ height: '180px', objectFit: 'cover' }}
                                    alt={svc.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title fw-bold text-dark mb-0">{svc.name}</h5>
                                        <span className="badge bg-success fs-6 rounded-pill">${svc.price}</span>
                                    </div>
                                    <p className="card-text text-muted flex-grow-1 fs-6">{svc.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <small className="text-muted">⏱ {svc.duration} mins • <span className="text-success fw-semibold">{svc.category}</span></small>
                                        <button
                                            onClick={() => handleOpenBookModal(svc._id)}
                                            className="btn btn-outline-success btn-sm rounded-pill px-4 fw-semibold shadow-sm">
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Salon Products */}
            {activeTab === 'products' && (
                <div className="row g-4">
                    {products.map((prod) => (
                        <div key={prod._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                <img
                                    src={prod.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'}
                                    className="card-img-top"
                                    style={{ height: '180px', objectFit: 'cover' }}
                                    alt={prod.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-dark mb-1">{prod.name}</h5>
                                    <p className="card-text text-muted flex-grow-1 small">{prod.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            <span className="fw-bold text-success fs-5">${prod.price}</span>
                                            {prod.stock !== undefined && (
                                                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                                    {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                                                </small>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleOpenOrderModal(prod)}
                                            disabled={prod.stock === 0}
                                            className="btn btn-success btn-sm rounded-pill px-3 fw-semibold shadow-sm">
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: Book Appointment */}
            {showBookModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <div>
                                    <h5 className="modal-title fw-bold text-dark">Book Your Salon Appointment</h5>
                                    <p className="text-muted small mb-0">Select your preferred treatment, master barber, and convenient time slot.</p>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowBookModal(false)}></button>
                            </div>
                            <form onSubmit={handleBookAppointment}>
                                <div className="modal-body pt-3">
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold text-dark">Select Service <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select rounded-3"
                                                value={bookingService}
                                                onChange={(e) => setBookingService(e.target.value)}
                                                required>
                                                <option value="">-- Choose a Service --</option>
                                                {services.map((s) => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.name} (${s.price} - {s.duration} mins)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold text-dark">Select Barber / Stylist <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select rounded-3"
                                                value={bookingBarber}
                                                onChange={(e) => setBookingBarber(e.target.value)}
                                                required>
                                                <option value="">-- Choose a Barber --</option>
                                                {barbers.map((b) => (
                                                    <option key={b._id} value={b._id}>
                                                        {b.name} {b.specializations?.length ? `(${Array.isArray(b.specializations) ? b.specializations.join(', ') : b.specializations})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold text-dark">Appointment Date <span className="text-danger">*</span></label>
                                            <input
                                                type="date"
                                                className="form-control rounded-3"
                                                min={todayDateStr}
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold text-dark">Select Time Slot <span className="text-danger">*</span></label>
                                            {loadingSlots ? (
                                                <div className="d-flex align-items-center gap-2 py-2">
                                                    <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                                                    <small className="text-muted">Checking available slots...</small>
                                                </div>
                                            ) : (
                                                <select
                                                    className="form-select rounded-3"
                                                    value={bookingTimeSlot}
                                                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                                                    required>
                                                    <option value="">-- Select Time Slot --</option>
                                                    {availableSlots.map((slot, idx) => {
                                                        const isAvail = typeof slot === 'object' ? slot.available !== false : true
                                                        const timeVal = typeof slot === 'object' ? slot.time : slot
                                                        return (
                                                            <option key={idx} value={timeVal} disabled={!isAvail}>
                                                                {timeVal} {!isAvail ? '(Booked)' : ''}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            )}
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold text-dark">Notes / Special Requests (Optional)</label>
                                            <textarea
                                                className="form-control rounded-3"
                                                rows="2"
                                                placeholder="Any styling preferences, hair length notes, or special requirements..."
                                                value={bookingNotes}
                                                onChange={(e) => setBookingNotes(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-pill px-4"
                                        onClick={() => setShowBookModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingBooking}
                                        className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm">
                                        {submittingBooking ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Cancel Appointment Confirmation */}
            {showCancelModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold text-danger">Cancel Appointment</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
                            </div>
                            <form onSubmit={handleConfirmCancel}>
                                <div className="modal-body pt-3">
                                    <p className="text-muted">
                                        Are you sure you want to cancel this appointment? This action cannot be undone.
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark">Reason for Cancellation (Optional)</label>
                                        <textarea
                                            className="form-control rounded-3"
                                            rows="2"
                                            placeholder="Change of schedule, feeling unwell, etc."
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-pill px-4"
                                        onClick={() => setShowCancelModal(false)}>
                                        Keep Appointment
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingCancel}
                                        className="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm">
                                        {submittingCancel ? 'Cancelling...' : 'Yes, Cancel Appointment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Order Product */}
            {showOrderModal && orderingProduct && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Order {orderingProduct.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
                            </div>
                            <form onSubmit={handlePlaceOrder}>
                                <div className="modal-body pt-3">
                                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mb-3">
                                        <img
                                            src={orderingProduct.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            className="rounded-3"
                                            alt={orderingProduct.name}
                                        />
                                        <div>
                                            <h6 className="fw-bold mb-0 text-dark">{orderingProduct.name}</h6>
                                            <small className="text-success fw-bold fs-6">${orderingProduct.price} each</small>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={orderingProduct.stock || 10}
                                            className="form-control rounded-3"
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark">Delivery Address (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="Street, City, Zip code"
                                            value={orderAddress}
                                            onChange={(e) => setOrderAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark">Contact Phone (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="+1 234 567 8900"
                                            value={orderPhone}
                                            onChange={(e) => setOrderPhone(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center p-3 bg-success-subtle text-success rounded-3">
                                        <span className="fw-bold">Total Amount:</span>
                                        <span className="fw-bold fs-5">
                                            ${(orderingProduct.price * (Number(orderQuantity) || 1)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-light rounded-pill px-4"
                                        onClick={() => setShowOrderModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingOrder}
                                        className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm">
                                        {submittingOrder ? 'Placing Order...' : 'Confirm Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}