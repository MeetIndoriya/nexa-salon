import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboard } from '../../backend/services/authService'
import { getAllAppointment, deleteAppointment } from '../../backend/services/appointmentService'
import { getAllServices, createService, updateService, deleteService } from '../../backend/services/serviceService'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../backend/services/productService'
import { getAllUsers, createUser, updateUser, deleteUser } from '../../backend/services/userService'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [services, setServices] = useState([])
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    const [showUserModal, setShowUserModal] = useState(false)
    const [editingUserId, setEditingUserId] = useState(null)
    const [userRoleFilter, setUserRoleFilter] = useState('All')
    const [userSearchTerm, setUserSearchTerm] = useState('')
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Customer',
        phone: '',
        isActive: true,
        specializations: '',
        experience: '',
        commissionRate: '',
        bio: ''
    })

    const [showServiceModal, setShowServiceModal] = useState(false)
    const [editingServiceId, setEditingServiceId] = useState(null)
    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        category: 'Haircut',
        price: '',
        duration: '',
        image: ''
    })

    // Modal / form states for Product CRUD
    const [showProductModal, setShowProductModal] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        category: 'Hair Care',
        price: '',
        brand: '',
        stockQuantity: '',
        image: ''
    })

    const token = localStorage.getItem('token')
    const checkRole = localStorage.getItem('User Role')

    const fetchData = async () => {
        setLoading(true)
        try {
            const adminResponse = await getAdminDashboard()
            setDashboard(adminResponse)
            const appointmentResponse = await getAllAppointment()
            setAppointments(appointmentResponse)
            const serviceResponse = await getAllServices()
            setServices(serviceResponse)
            const productResponse = await getAllProducts()
            setProducts(productResponse)
            const userResponse = await getAllUsers()
            setUsers(userResponse.data)
        } catch (error) {
            console.error('Error fetching admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token || checkRole !== 'Admin') {
            navigate('/login')
            return
        }
        fetchData()
    }, [])

    const handleCancelAppointment = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            await deleteAppointment(id)
            setAppointments((data) => data.filter((app) => app._id !== id))
        }
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id)
                setUsers((data) => data.filter((user) => user._id !== id))
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user')
            }
        }
    }

    // --- User CRUD Handlers ---
    const handleOpenAddUser = (defaultRole = 'Customer') => {
        setEditingUserId(null)
        setUserForm({
            name: '',
            email: '',
            password: '',
            role: defaultRole,
            phone: '',
            isActive: true,
            specializations: '',
            experience: '',
            commissionRate: '',
            bio: ''
        })
        setShowUserModal(true)
    }

    const handleOpenEditUser = (user) => {
        setEditingUserId(user._id)
        setUserForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'Customer',
            phone: user.phone || '',
            isActive: user.isActive !== undefined ? user.isActive : true,
            specializations: Array.isArray(user.specializations) ? user.specializations.join(', ') : (user.specializations || ''),
            experience: user.experience ?? '',
            commissionRate: user.commissionRate ?? '',
            bio: user.bio || ''
        })
        setShowUserModal(true)
    }

    const handleSaveUser = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                phone: userForm.phone,
                isActive: userForm.isActive,
                bio: userForm.bio,
            }
            if (userForm.role === 'Barber') {
                payload.specializations = userForm.specializations
                    ? userForm.specializations.split(',').map(s => s.trim()).filter(Boolean)
                    : []
                payload.experience = userForm.experience !== '' ? Number(userForm.experience) : 0
                payload.commissionRate = userForm.commissionRate !== '' ? Number(userForm.commissionRate) : 0
            }
            if (editingUserId) {
                if (userForm.password) {
                    payload.password = userForm.password
                }
                const res = await updateUser(editingUserId, payload)
                const updatedUser = res.data || res
                setUsers((prev) => prev.map((u) => u._id === editingUserId ? { ...u, ...updatedUser } : u))
            } else {
                payload.password = userForm.password || '123456'
                const res = await createUser(payload)
                const createdUser = res.data || res.user || res
                setUsers((prev) => [createdUser, ...prev])
            }
            setShowUserModal(false)
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to save user')
        }
    }

    const handleOpenAddService = () => {
        setEditingServiceId(null)
        setServiceForm({
            name: '',
            description: '',
            category: 'Haircut',
            price: '',
            duration: '',
            image: ''
        })
        setShowServiceModal(true)
    }

    const handleOpenEditService = (svc) => {
        setEditingServiceId(svc._id)
        setServiceForm({
            name: svc.name || '',
            description: svc.description || '',
            category: svc.category || 'Haircut',
            price: svc.price || '',
            duration: svc.duration || '',
            image: svc.image || ''
        })
        setShowServiceModal(true)
    }

    const handleDeleteService = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await deleteService(id)
                setServices((prev) => prev.filter((s) => s._id !== id))
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete service')
            }
        }
    }

    const handleSaveService = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...serviceForm,
                price: Number(serviceForm.price),
                duration: Number(serviceForm.duration)
            }
            if (editingServiceId) {
                const updated = await updateService(editingServiceId, payload)
                setServices((prev) => prev.map((s) => s._id === editingServiceId ? updated : s))
            } else {
                const created = await createService(payload)
                setServices((prev) => [...prev, created])
            }
            setShowServiceModal(false)
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save service')
        }
    }

    // --- Product CRUD Handlers ---
    const handleOpenAddProduct = () => {
        setEditingProductId(null)
        setProductForm({
            name: '',
            description: '',
            category: 'Hair Care',
            price: '',
            brand: '',
            stockQuantity: '',
            image: ''
        })
        setShowProductModal(true)
    }

    const handleOpenEditProduct = (prod) => {
        setEditingProductId(prod._id)
        setProductForm({
            name: prod.name || '',
            description: prod.description || '',
            category: prod.category || 'Hair Care',
            price: prod.price || '',
            brand: prod.brand || '',
            stockQuantity: prod.stockQuantity || 0,
            image: prod.image || ''
        })
        setShowProductModal(true)
    }

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id)
                setProducts((prev) => prev.filter((p) => p._id !== id))
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product')
            }
        }
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price),
                stockQuantity: Number(productForm.stockQuantity || 0)
            }
            if (editingProductId) {
                const updated = await updateProduct(editingProductId, payload)
                setProducts((prev) => prev.map((p) => p._id === editingProductId ? updated : p))
            } else {
                const created = await createProduct(payload)
                setProducts((prev) => [...prev, created])
            }
            setShowProductModal(false)
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save product')
        }
    }

    if (loading) {
        return (
            <div className="container text-center my-5 py-5">
                <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading dashboard...</span>
                </div>
                <p className="mt-3 text-muted fw-semibold">Loading admin control panel...</p>
            </div>
        )
    }

    if (!dashboard) return null

    const totalUsers = dashboard.totalUsers
    const totalAppointments = dashboard.totalAppointments
    const pendingAppointments = dashboard.pendingAppointments
    const totalRevenue = dashboard.totalRevenue
    const topBarbers = dashboard.topBarbers
    const recentCustomers = dashboard.recentCustomers

    return (
        <div className="container py-4">

            <div className="bg-gradient bg-success text-white p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="w-100 text-center">
                        <h2 className="fw-bold mb-1 text-white">Admin Dashboard</h2>
                        <p className="mb-0 text-white-50">Oversee system revenue, salon bookings, user accounts, and inventory items.</p>
                    </div>
                    <div className="mt-3 mt-md-0">
                        <button onClick={() => navigate('/')} className="btn btn-light text-success fw-bold rounded-pill px-4 me-2">
                            Explore Salon
                        </button>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-success">
                                <i className="fs-4 fs-md-3">👥</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Total Users</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{totalUsers}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-primary">
                                <i className="fs-4 fs-md-3">📅</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Total Bookings</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{totalAppointments}</h3>
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
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Pending Requests</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">{pendingAppointments}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body d-flex flex-column flex-lg-row align-items-center text-center text-lg-start p-2 p-md-3">
                            <div className="rounded-circle bg-info bg-opacity-10 p-2 p-md-3 mb-2 mb-lg-0 me-lg-3 text-info">
                                <i className="fs-4 fs-md-3">💳</i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="card-subtitle text-muted mb-1 small text-truncate">Total Revenue</h6>
                                <h3 className="card-title fw-bold mb-0 text-dark fs-5 fs-md-3">${Number(totalRevenue).toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'overview' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('overview')}>
                        Overview & Appointments
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'users' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('users')}>
                        User Management
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'services' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('services')}>
                        Browse Services
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'products' ? 'active bg-success' : 'text-dark bg-light'}`}
                        onClick={() => setActiveTab('products')}>
                        Salon Products
                    </button>
                </li>
            </ul>

            {activeTab === 'overview' && (
                <div className="row g-4">
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-dark">All Salon Appointments</h5>
                                <span className="badge bg-success-subtle text-success rounded-pill px-3">
                                    {appointments.length} Total
                                </span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 text-center">
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
                                        {appointments.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="fw-bold">{item.date}</div>
                                                    <small className="text-muted">{item.timeSlot}</small>
                                                </td>
                                                <td className="fw-semibold text-dark">{item.service?.name || 'Service not found'}</td>
                                                <td>{item.barber?.name || 'Unassigned'}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${item.status === 'Completed' ? 'bg-success' :
                                                        item.status === 'Cancelled' ? 'bg-danger' :
                                                            item.status === 'In Progress' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    {item.status !== 'Cancelled' && item.status !== 'Completed' && (
                                                        <button
                                                            onClick={() => handleCancelAppointment(item._id)}
                                                            className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-white py-3 border-0">
                                <h5 className="fw-bold mb-0 text-dark">Top Performing Barbers</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Barber Name</th>
                                            <th>Services Done</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topBarbers.map((barber, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold text-dark">{barber.barber}</td>
                                                <td className="fw-semibold">{barber.completedCount} visits</td>
                                                <td className="fw-bold text-success">${(barber.revenue).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-white py-3 border-0">
                                <h5 className="fw-bold mb-0 text-dark">Recent Customer Registrations</h5>
                            </div>
                            <div className="list-group list-group-flush">
                                {recentCustomers.map((cust) => (
                                    <div key={cust._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h6 className="fw-bold mb-0 text-dark">{cust.name}</h6>
                                            <small className="text-muted">{cust.email}</small>
                                        </div>
                                        <span className="badge bg-success-subtle text-success fw-bold">{cust.phone}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 text-dark">User & Staff Directory</h4>
                            <p className="text-muted small mb-0">Manage customer accounts, barbers, receptionists, and administrators.</p>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            <button onClick={() => handleOpenAddUser('Customer')} className="btn btn-outline-success rounded-pill px-3 fw-semibold btn-sm shadow-sm">
                                + Add Customer
                            </button>
                            <button onClick={() => handleOpenAddUser('Barber')} className="btn btn-primary rounded-pill px-3 fw-semibold btn-sm shadow-sm">
                                + Add Barber
                            </button>
                            <button onClick={() => handleOpenAddUser('Receptionist')} className="btn btn-info text-dark rounded-pill px-3 fw-semibold btn-sm shadow-sm">
                                + Add Receptionist
                            </button>
                            <button onClick={() => handleOpenAddUser('Admin')} className="btn btn-success rounded-pill px-3 fw-semibold btn-sm shadow-sm">
                                + Add Admin
                            </button>
                        </div>
                    </div>

                    {/* Role Filter & Search Toolbar */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                            <div className="d-flex flex-wrap gap-2">
                                {['All', 'Customer', 'Barber', 'Receptionist', 'Admin'].map((role) => {
                                    const count = role === 'All' ? users.length : users.filter((u) => u.role === role).length
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => setUserRoleFilter(role)}
                                            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                                                userRoleFilter === role
                                                    ? 'btn-success text-white'
                                                    : 'btn-light border text-dark'
                                            }`}
                                        >
                                            {role === 'All' ? 'All Roles' : `${role}s`} ({count})
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="w-100 w-md-auto" style={{ minWidth: '260px' }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill px-3"
                                    placeholder="🔍 Search by name, email, phone..."
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Users Directory Table */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">
                                {userRoleFilter === 'All' ? 'All Users & Staff' : `${userRoleFilter} Directory`}
                            </h5>
                            <span className="badge bg-success-subtle text-success rounded-pill px-3">
                                {users.filter((u) => {
                                    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter
                                    const matchesSearch = !userSearchTerm ||
                                        (u.name && u.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                        (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                        (u.phone && u.phone.toLowerCase().includes(userSearchTerm.toLowerCase()))
                                    return matchesRole && matchesSearch
                                }).length} Found
                            </span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>User Details</th>
                                        <th>Contact</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Role Details</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter((u) => {
                                        const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter
                                        const matchesSearch = !userSearchTerm ||
                                            (u.name && u.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                            (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                            (u.phone && u.phone.toLowerCase().includes(userSearchTerm.toLowerCase()))
                                        return matchesRole && matchesSearch
                                    }).length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                No users found matching the selected criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.filter((u) => {
                                            const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter
                                            const matchesSearch = !userSearchTerm ||
                                                (u.name && u.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                                (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
                                                (u.phone && u.phone.toLowerCase().includes(userSearchTerm.toLowerCase()))
                                            return matchesRole && matchesSearch
                                        }).map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-dark border" style={{ width: '40px', height: '40px' }}>
                                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{user.name}</div>
                                                            {user.bio && <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{user.bio}</small>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div><small className="text-muted">{user.email}</small></div>
                                                    <div className="small fw-semibold text-dark">{user.phone || 'No phone'}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 ${
                                                        user.role === 'Admin' ? 'bg-danger' :
                                                        user.role === 'Barber' ? 'bg-primary' :
                                                        user.role === 'Receptionist' ? 'bg-info text-dark' : 'bg-secondary'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill ${user.isActive !== false ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                        {user.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {user.role === 'Barber' ? (
                                                        <div className="small">
                                                            {user.specializations && user.specializations.length > 0 && (
                                                                <div className="d-flex flex-wrap gap-1 mb-1">
                                                                    {user.specializations.map((spec, i) => (
                                                                        <span key={i} className="badge bg-light text-dark border">{spec}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="text-muted">
                                                                <span>Exp: {user.experience || 0} yrs</span>
                                                                {user.commissionRate !== undefined && <span className="ms-2">Comm: {user.commissionRate}%</span>}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    <div className="btn-group">
                                                        <button
                                                            onClick={() => handleOpenEditUser(user)}
                                                            className="btn btn-outline-primary btn-sm rounded-pill px-3 me-1">
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0 text-dark">Services Catalog</h4>
                        <button onClick={handleOpenAddService} className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm">
                            + Add New Service
                        </button>
                    </div>
                    <div className="row g-4">
                        {services.map((svc) => (
                            <div key={svc._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                                    <div className="position-relative">
                                        <img src={svc.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} alt={svc.name} />
                                        <span className="position-absolute top-0 end-0 m-3 badge bg-white bg-opacity-75 text-dark rounded-pill px-3 py-1 shadow-sm fw-semibold">${svc.price}</span>
                                    </div>
                                    <div className="card-body d-flex flex-column p-4 flex-grow-1">
                                        <small className="text-muted mb-2 d-flex align-items-center gap-1">
                                            ⏱ {svc.duration} mins
                                        </small>
                                        <h5 className="card-title fw-bold text-dark mb-2">{svc.name}</h5>
                                        <p className="card-text text-muted flex-grow-1 small mb-4">{svc.description}</p>
                                        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                                            <span className="badge bg-success-subtle text-success rounded-pill">{svc.category}</span>
                                            <div className="btn-group">
                                                <button onClick={() => handleOpenEditService(svc)} className="btn btn-outline-primary btn-sm rounded-pill px-2 me-1">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteService(svc._id)} className="btn btn-outline-danger btn-sm rounded-pill px-2">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0 text-dark">Products Catalog</h4>
                        <button onClick={handleOpenAddProduct} className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm">
                            + Add New Product
                        </button>
                    </div>
                    <div className="row g-4">
                        {products.map((prod) => (
                            <div key={prod._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                                    <img
                                        src={prod.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'}
                                        className="card-img-top"
                                        style={{ height: '180px', objectFit: 'cover' }}
                                        alt={prod.name} />
                                    <div className="card-body d-flex flex-column p-4 flex-grow-1">
                                        <h5 className="card-title fw-bold text-dark mb-1">{prod.name}</h5>
                                        <small className="text-muted mb-2">{prod.brand || 'Nexa Brand'} • {prod.category}</small>
                                        <p className="card-text text-muted flex-grow-1 small mb-4">{prod.description}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                            <div>
                                                <span className="fw-bold text-success fs-5 me-2">${prod.price}</span>
                                                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">Stock: {prod.stockQuantity ?? 0}</span>
                                            </div>
                                            <div className="btn-group">
                                                <button onClick={() => handleOpenEditProduct(prod)} className="btn btn-outline-primary btn-sm rounded-pill px-2 me-1">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteProduct(prod._id)} className="btn btn-outline-danger btn-sm rounded-pill px-2">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Modal (Customer, Barber, Receptionist, Admin) */}
            {showUserModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <form onSubmit={handleSaveUser}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">
                                        {editingUserId ? `Edit ${userForm.role}` : `Add New ${userForm.role}`}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowUserModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Role</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={userForm.role}
                                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                            >
                                                <option value="Customer">Customer (User)</option>
                                                <option value="Barber">Barber</option>
                                                <option value="Receptionist">Receptionist</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Active Status</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={userForm.isActive ? 'true' : 'false'}
                                                onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'true' })}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-3"
                                                required
                                                placeholder="e.g. John Doe"
                                                value={userForm.name}
                                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control rounded-3"
                                                required
                                                placeholder="e.g. john@example.com"
                                                value={userForm.email}
                                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">
                                                Password {editingUserId && <small className="text-muted fw-normal">(leave blank to keep current)</small>}
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                required={!editingUserId}
                                                placeholder={editingUserId ? "Leave blank to keep unchanged" : "Enter password (min 6 chars)"}
                                                value={userForm.password}
                                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Phone Number</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-3"
                                                placeholder="e.g. +1 234 567 890"
                                                value={userForm.phone}
                                                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                            />
                                        </div>

                                        {userForm.role === 'Barber' && (
                                            <>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold">Specializations <small className="text-muted fw-normal">(comma-separated)</small></label>
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-3"
                                                        placeholder="Haircut, Beard Styling, Hair Coloring, Facial"
                                                        value={userForm.specializations}
                                                        onChange={(e) => setUserForm({ ...userForm, specializations: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-semibold">Experience (Years)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="form-control rounded-3"
                                                        placeholder="e.g. 5"
                                                        value={userForm.experience}
                                                        onChange={(e) => setUserForm({ ...userForm, experience: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-semibold">Commission Rate (%)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control rounded-3"
                                                        placeholder="e.g. 15"
                                                        value={userForm.commissionRate}
                                                        onChange={(e) => setUserForm({ ...userForm, commissionRate: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Bio / Notes</label>
                                            <textarea
                                                className="form-control rounded-3"
                                                rows="2"
                                                placeholder="Brief bio or notes..."
                                                value={userForm.bio}
                                                onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowUserModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                                        {editingUserId ? 'Update User' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <form onSubmit={handleSaveService}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowServiceModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Service Name</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            required
                                            value={serviceForm.name}
                                            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Category</label>
                                        <select
                                            className="form-select rounded-3"
                                            value={serviceForm.category}
                                            onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                                        >
                                            <option value="Haircut">Haircut</option>
                                            <option value="Beard Styling">Beard Styling</option>
                                            <option value="Hair Coloring">Hair Coloring</option>
                                            <option value="Facial">Facial</option>
                                            <option value="Spa">Spa</option>
                                            <option value="Massage">Massage</option>
                                            <option value="Manicure">Manicure</option>
                                            <option value="Pedicure">Pedicure</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control rounded-3"
                                                required
                                                value={serviceForm.price}
                                                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Duration (mins)</label>
                                            <input
                                                type="number"
                                                className="form-control rounded-3"
                                                required
                                                value={serviceForm.duration}
                                                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="https://..."
                                            value={serviceForm.image}
                                            onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            className="form-control rounded-3"
                                            rows="3"
                                            value={serviceForm.description}
                                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowServiceModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                                        {editingServiceId ? 'Update Service' : 'Create Service'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <form onSubmit={handleSaveProduct}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            required
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Category</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                            >
                                                <option value="Hair Care">Hair Care</option>
                                                <option value="Skin Care">Skin Care</option>
                                                <option value="Beard Care">Beard Care</option>
                                                <option value="Styling">Styling</option>
                                                <option value="Tools">Tools</option>
                                                <option value="Accessories">Accessories</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Brand</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-3"
                                                value={productForm.brand}
                                                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control rounded-3"
                                                required
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Stock Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control rounded-3"
                                                value={productForm.stockQuantity}
                                                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            placeholder="https://..."
                                            value={productForm.image}
                                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            className="form-control rounded-3"
                                            rows="3"
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowProductModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                                        {editingProductId ? 'Update Product' : 'Create Product'}
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

