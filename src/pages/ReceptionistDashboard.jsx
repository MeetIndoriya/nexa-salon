import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReceptionistDashboard } from '../../backend/services/authService'
import { updateAppointmentStatus } from '../../backend/services/appointmentService'
import { registerCustomer } from '../../backend/services/userService'

export default function ReceptionistDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('today')

    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const [customerForm, setCustomerForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })

    const token = localStorage.getItem('token')
    const checkRole = localStorage.getItem('User Role')

    const loadData = async () => {
        setLoading(true)
        try {
            const response = await getReceptionistDashboard()
            setDashboard(response)
        } catch (err) {
            console.error('Error loading receptionist dashboard:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token || checkRole !== 'Receptionist') {
            navigate('/login')
            return
        }
        loadData()
    }, [])

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateAppointmentStatus(id, status)
            setDashboard((prev) => {
                if (!prev) return prev
                const updatedToday = prev.todayAppointments.map((app) =>
                    app._id === id ? { ...app, status } : app
                )
                const updatedPending = prev.pendingAppointments.map((app) =>
                    app._id === id ? { ...app, status } : app
                )
                return {
                    ...prev,
                    todayAppointments: updatedToday,
                    pendingAppointments: updatedPending.filter((app) => status === 'Confirmed' ? false : true),
                    pendingCount: status === 'Confirmed' ? Math.max(0, prev.pendingCount - 1) : prev.pendingCount
                }
            })
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status')
        }
    }

    const handleRegisterCustomer = async (e) => {
        e.preventDefault()
        try {
            const res = await registerCustomer({
                ...customerForm,
                role: 'Customer',
            })
            const newCust = res.user || res.data || { ...customerForm, _id: Date.now() }
            setDashboard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    recentCustomers: [newCust, ...(prev.recentCustomers || [])]
                }
            })
            setShowCustomerModal(false)
            setCustomerForm({ name: '', email: '', password: '', phone: '' })
            alert('Customer registered successfully!')
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to register customer')
        }
    }

    if (loading) {
        return (
            <div className="container text-center my-5 py-5">
                <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading dashboard...</span>
                </div>
                <p className="mt-3 text-muted fw-semibold">Loading receptionist portal...</p>
            </div>
        )
    }

    if (!dashboard) return null

    const todayAppointments = dashboard.todayAppointments || []
    const pendingAppointments = dashboard.pendingAppointments || []
    const availableBarbers = dashboard.availableBarbers || []
    const recentCustomers = dashboard.recentCustomers || []
    const todayCount = dashboard.todayCount || 0
    const pendingCount = dashboard.pendingCount || 0

    return (
        <div className="container py-4">
            <div className="bg-gradient bg-success text-white p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="w-100  text-center">
                        <h2 className="fw-bold mb-1 text-white">Receptionist Desk</h2>
                        <p className="mb-0 text-white-50 ">Monitor booking flows, active barbers, and check daily salon activity.</p>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-success">
                                <i className="fs-4 fs-md-3">📅</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Today's Visits</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{todayCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-warning">
                                <i className="fs-4 fs-md-3">⏳</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Pending Approval</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{pendingCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-primary">
                                <i className="fs-4 fs-md-3">💈</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Active Barbers</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{availableBarbers.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-info bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-info">
                                <i className="fs-4 fs-md-3">👥</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Customers Listed</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{recentCustomers.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'today' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('today')}>
                        Today's Appointments
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'pending' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('pending')}>
                        Pending Requests ({pendingCount})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'barbers' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('barbers')}>
                        Active Barbers
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'customers' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('customers')}>
                        Customer Directory
                    </button>
                </li>
            </ul>

            {activeTab === 'today' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-dark">Today's Appointments</h5>
                        <span className="badge bg-success-subtle text-success rounded-pill px-3">
                            {todayAppointments.length} Booked
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>Time Slot</th>
                                    <th>Customer</th>
                                    <th>Barber Assigned</th>
                                    <th>Service Details</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAppointments.map((item) => (
                                    <tr key={item._id}>
                                        <td className="fw-bold text-success">{item.timeSlot}</td>
                                        <td>
                                            <div className="fw-semibold text-dark">{item.customer?.name || 'Customer'}</div>
                                            <small className="text-muted">{item.customer?.phone || ''}</small>
                                        </td>
                                        <td className="fw-semibold">{item.barber?.name || 'Unassigned'}</td>
                                        <td>
                                            <div className="fw-semibold text-dark">{item.service?.name || 'Service'}</div>
                                            <small className="text-muted">⏱ {item.service?.duration || '30'} mins</small>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${item.status === 'Completed' ? 'bg-success' :
                                                item.status === 'Cancelled' ? 'bg-danger' :
                                                    item.status === 'In Progress' ? 'bg-info text-dark' :
                                                        item.status === 'Confirmed' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            {item.status !== 'Completed' && item.status !== 'Cancelled' && (
                                                <div className="btn-group">
                                                    {item.status !== 'In Progress' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                                                            className="btn btn-outline-info btn-sm rounded-pill px-2 me-1">
                                                            Start
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUpdateStatus(item._id, 'Completed')}
                                                        className="btn btn-outline-success btn-sm rounded-pill px-2 me-1">
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(item._id, 'Cancelled')}
                                                        className="btn btn-outline-danger btn-sm rounded-pill px-2">
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

            {activeTab === 'pending' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-dark">Pending Booking Requests</h5>
                        <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3">
                            {pendingAppointments.length} Awaiting
                        </span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Customer</th>
                                    <th>Preferred Barber</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingAppointments.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="fw-bold">{item.date}</div>
                                            <small className="text-success fw-semibold">{item.timeSlot}</small>
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">{item.customer?.name || 'Customer'}</div>
                                            <small className="text-muted">{item.customer?.phone || ''}</small>
                                        </td>
                                        <td className="fw-semibold">{item.barber?.name || 'Any Barber'}</td>
                                        <td className="fw-semibold text-dark">{item.service?.name || 'Service'}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${item.status === 'Completed' ? 'bg-success' :
                                                item.status === 'Cancelled' ? 'bg-danger' :
                                                    item.status === 'In Progress' ? 'bg-info text-dark' :
                                                        item.status === 'Confirmed' ? 'bg-primary' : 'bg-warning text-dark'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group">
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'Confirmed')}
                                                    className="btn btn-success btn-sm rounded-pill px-3 me-1">
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item._id, 'Cancelled')}
                                                    className="btn btn-outline-danger btn-sm rounded-pill px-2">
                                                    Decline
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'barbers' && (
                <div className="row g-4">
                    {availableBarbers.map((barber) => (
                        <div key={barber._id} className="col-12 col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3 text-success fw-bold fs-4">
                                        💈
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0 text-dark">{barber.name}</h5>
                                        <span className="badge bg-success-subtle text-success rounded-pill mt-1">Available</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <h6 className="fw-semibold small text-muted mb-1">Specializations</h6>
                                    <div className="d-flex flex-wrap gap-1">
                                        {barber.specializations && barber.specializations.length > 0 ? (
                                            barber.specializations.map((spec, i) => (
                                                <span key={i} className="badge bg-light text-dark border rounded-pill">{spec}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted small">General Hair Styling</span>
                                        )}
                                    </div>
                                </div>
                                <div className="border-top pt-2">
                                    <h6 className="fw-semibold small text-muted mb-1">Working Hours</h6>
                                    <p className="small mb-0 text-dark">
                                        🕒 {barber.workingHours.start} - {barber.workingHours.end}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'customers' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-dark">Registered Customer Directory</h5>
                        <button
                            onClick={() => setShowCustomerModal(true)}
                            className="btn btn-success btn-sm rounded-pill px-3 fw-semibold shadow-sm">
                            + Register New Customer
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCustomers.map((customer) => (
                                    <tr key={customer._id}>
                                        <td className="fw-bold text-dark">{customer.name}</td>
                                        <td className="text-muted">{customer.email}</td>
                                        <td className="fw-semibold">{customer.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Register Customer Modal */}
            {showCustomerModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <form onSubmit={handleRegisterCustomer}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Register New Customer</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowCustomerModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            required
                                            placeholder="e.g. Jane Doe"
                                            value={customerForm.name}
                                            onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control rounded-3"
                                            required
                                            placeholder="e.g. jane@example.com"
                                            value={customerForm.email}
                                            onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-3"
                                            required
                                            placeholder="Minimum 6 characters"
                                            value={customerForm.password}
                                            onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="e.g. +1 555 123 4567"
                                            value={customerForm.phone}
                                            onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowCustomerModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">Register Customer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
