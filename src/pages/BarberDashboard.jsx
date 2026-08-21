import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBarberDashboard } from '../../backend/services/authService'
import { getMyAppointmentBarber, updateAppointmentStatus } from '../../backend/services/appointmentService'
import { getAllServices } from '../../backend/services/serviceService'

export default function BarberDashboard() {
    const navigate = useNavigate()

    const [dashboard, setDashboard] = useState(null)
    const [myAppointments, setMyAppointments] = useState([])
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    const token = localStorage.getItem('token')
    const checkRole = localStorage.getItem('User Role')

    const fetchData = async () => {
        setLoading(true)

        const barberResponse = await getBarberDashboard()
        setDashboard(barberResponse)

        const appointmentResponse = await getMyAppointmentBarber()
        setMyAppointments(appointmentResponse)

        const serviceResponse = await getAllServices()
        setServices(serviceResponse)

        setLoading(false)
    }

    useEffect(() => {
        if (!token || checkRole !== 'Barber') {
            navigate('/login')
            return
        }

        fetchData()
    }, [])

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateAppointmentStatus(id, status)
            setMyAppointments((prev) =>
                prev.map((app) => (app._id === id ? { ...app, status } : app))
            )
            setDashboard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    todayAppointments: prev.todayAppointments.map((app) =>
                        app._id === id ? { ...app, status } : app
                    ),
                    upcomingAppointments: prev.upcomingAppointments.map((app) =>
                        app._id === id ? { ...app, status } : app
                    ),
                }
            })
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update appointment status')
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
                <div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
                    role="status"
                />

                <p className="mt-4 font-semibold text-gray-500">
                    Loading your barber workspace...
                </p>
            </div>
        )
    }

    if (!dashboard) return null

    console.log(dashboard)

    const todayAppointments = dashboard.todayAppointments
    const upcomingAppointments = dashboard.upcomingAppointments
    const monthlyEarnings = dashboard.monthlyEarnings
    const totalCompleted = dashboard.totalCompleted
    const commissionRate = dashboard.commissionRate

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
            <div className="mb-6 rounded-2xl bg-linear-to-r from-green-600 to-green-700 p-5 text-white  md:p-6 my-5 ">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

                    <div className="w-full text-center">
                        <h2 className="mb-1 font-bold text-white ">Barber Dashboard</h2>

                        <p className="text-sm text-green-100 md:text-base">
                            Manage your daily appointments, track earnings, and review assigned clients.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <button
                            onClick={() => navigate('/')}
                            className="rounded-full bg-white text-lg font-bold text-green-600 shadow-md transition-all duration-200 hover:bg-green-50 hover:shadow-xl px-5 py-2 ">Explore Salon
                        </button>
                    </div>

                </div>
            </div>

            {/* ================= STAT CARDS ================= */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 my-5">

                {/* Today's Schedule */}
                <div className="h-full rounded-2xl bg-white shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl ">
                    <div className="flex h-full flex-col items-center p-3 text-center sm:p-4 lg:flex-row lg:text-left">

                        <div className="mb-2 flex shrink-0 items-center justify-center rounded-full bg-green-50 p-3 text-green-600 lg:mb-0 lg:mr-3">
                            <span className="text-xl">📅</span>
                        </div>

                        <div className="min-w-0 overflow-hidden">
                            <p className="mb-1 truncate text-xs font-medium text-gray-500 sm:text-sm">
                                Today's Schedule
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {todayAppointments.length}
                            </h3>
                        </div>

                    </div>
                </div>

                {/* Total Completed */}
                <div className="h-full rounded-2xl bg-white shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="flex h-full flex-col items-center p-3 text-center sm:p-4 lg:flex-row lg:text-left">

                        <div className="mb-2 flex shrink-0 items-center justify-center rounded-full bg-blue-50 p-3 text-blue-600 lg:mb-0 lg:mr-3">
                            <span className="text-xl">✔</span>
                        </div>

                        <div className="min-w-0 overflow-hidden">
                            <p className="mb-1 truncate text-xs font-medium text-gray-500 sm:text-sm">
                                Total Completed
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {totalCompleted}
                            </h3>
                        </div>

                    </div>
                </div>

                {/* Upcoming */}
                <div className="h-full rounded-2xl bg-white shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="flex h-full flex-col items-center p-3 text-center sm:p-4 lg:flex-row lg:text-left">

                        <div className="mb-2 flex shrink-0 items-center justify-center rounded-full bg-yellow-50 p-3 text-yellow-600 lg:mb-0 lg:mr-3">
                            <span className="text-xl">⏳</span>
                        </div>

                        <div className="min-w-0 overflow-hidden">
                            <p className="mb-1 truncate text-xs font-medium text-gray-500 sm:text-sm">
                                Upcoming
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {upcomingAppointments.length}
                            </h3>
                        </div>

                    </div>
                </div>

                {/* Monthly Earnings */}
                <div className="h-full rounded-2xl bg-white shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="flex h-full flex-col items-center p-3 text-center sm:p-4 lg:flex-row lg:text-left">

                        <div className="mb-2 flex shrink-0 items-center justify-center rounded-full bg-cyan-50 p-3 text-cyan-600 lg:mb-0 lg:mr-3">
                            <span className="text-xl">💳</span>
                        </div>

                        <div className="min-w-0 overflow-hidden">
                            <p className="mb-1 truncate text-xs font-medium text-gray-500 sm:text-sm">
                                Monthly Earnings
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">
                                ${Number(monthlyEarnings.totalEarnings).toFixed(2)}
                            </h3>
                        </div>

                    </div>
                </div>

            </div>

            {/* ================= TABS ================= */}
            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">

                <button
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'overview'
                            ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview & Schedule
                </button>

                <button
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'allAppointments'
                            ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('allAppointments')}
                >
                    All My Appointments ({myAppointments.length})
                </button>

                <button
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'services'
                            ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('services')}
                >
                    Salon Services
                </button>

            </div>

            {/* =====================================================
                OVERVIEW TAB
            ====================================================== */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* Today's Schedule */}
                    <div className="lg:col-span-7">
                        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg">

                            <div className="flex flex-col gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <h5 className="font-bold text-gray-900">
                                    Today's Schedule
                                </h5>

                                <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                                    {todayAppointments.length} Booked Today
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] text-center text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">
                                            Time Slot
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Customer
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Service
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-right font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                    {todayAppointments.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-green-600">
                                                    {item.timeSlot}
                                                </div>

                                                <small className="text-gray-500">
                                                    {item.date}
                                                </small>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="font-semibold text-gray-900">
                                                    {item.customer?.name || 'Customer'}
                                                </div>

                                                <small className="text-gray-500">
                                                    {item.customer?.phone || ''}
                                                </small>
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-gray-900">
                                                {item.service?.name || 'Service'}
                                            </td>

                                            <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            item.status === 'Completed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : item.status === 'Cancelled'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : item.status === 'In Progress'
                                                                        ? 'bg-cyan-100 text-cyan-700'
                                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                {item.status !== 'Completed' &&
                                                    item.status !== 'Cancelled' && (
                                                        <div className="flex justify-end gap-2">

                                                            {item.status !== 'In Progress' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                                                                    className="rounded-full border border-cyan-500 px-3 py-1.5 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-50">
                                                                    Start
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleUpdateStatus(item._id, 'Completed')}
                                                                className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-700">
                                                                Complete
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
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5">

                        {/* Earnings */}
                        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg my-3">

                            <div className="border-b border-gray-100 bg-white px-5 py-4">
                                <h5 className="font-bold text-gray-900">
                                    Earnings & Performance Summary
                                </h5>
                            </div>

                            <div className="p-5">

                                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">
                                            Monthly Gross Earnings
                                        </p>

                                        <h4 className="font-bold text-gray-900">
                                            ${Number(monthlyEarnings.totalEarnings).toFixed(2)}
                                        </h4>
                                    </div>

                                    <span className="rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-600">
                                        💰 Sales
                                    </span>
                                </div>

                                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">
                                            Commission Earned
                                        </p>

                                        <h4 className="font-bold text-green-600">
                                            ${Number(monthlyEarnings.totalCommission).toFixed(2)}
                                        </h4>
                                    </div>

                                    <span className="rounded-full bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-600">
                                        {commissionRate}% Rate
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">
                                            Monthly Services Completed
                                        </p>

                                        <h5 className="font-bold text-gray-900">
                                            {monthlyEarnings.servicesCompleted} Treatments
                                        </h5>
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                                        ✂️ Performed
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Upcoming Appointments */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

                            <div className="border-b border-gray-100 bg-white px-5 py-4">
                                <h5 className="font-bold text-gray-900">
                                    Upcoming Appointments Preview
                                </h5>
                            </div>

                            <div className="divide-y divide-gray-100">

                                {upcomingAppointments.slice(0, 4).map((app) => (
                                    <div
                                        key={app._id}
                                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="min-w-0">
                                            <h6 className="truncate font-bold text-gray-900">
                                                {app.service?.name || 'Service'}
                                            </h6>

                                            <p className="truncate text-xs text-gray-500">
                                                Client: {app.customer?.name || 'Customer'} • {app.date} ({app.timeSlot})
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                                            ${app.service?.price ?? 0}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* =====================================================
                ALL APPOINTMENTS TAB
            ====================================================== */}
            {activeTab === 'allAppointments' && (
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

                    <div className="flex flex-col gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <h5 className="font-bold text-gray-900">
                            All Assigned Appointments
                        </h5>

                        <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                            {myAppointments.length} Total
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-5 py-3 font-semibold">
                                    Date & Time
                                </th>

                                <th className="px-5 py-3 font-semibold">
                                    Service
                                </th>

                                <th className="px-5 py-3 font-semibold">
                                    Customer
                                </th>

                                <th className="px-5 py-3 font-semibold">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-right font-semibold">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                            {myAppointments.map((item) => (
                                <tr
                                    key={item._id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-gray-900">
                                            {item.date}
                                        </div>

                                        <small className="text-gray-500">
                                            {item.timeSlot}
                                        </small>
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        {item.service?.name || 'Service'}
                                    </td>

                                    <td className="px-5 py-4 text-gray-700">
                                        {item.customer?.name || 'Customer'}
                                    </td>

                                    <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    item.status === 'Completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : item.status === 'Cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : item.status === 'In Progress'
                                                                ? 'bg-cyan-100 text-cyan-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        {item.status !== 'Completed' &&
                                            item.status !== 'Cancelled' && (
                                                <div className="flex justify-end gap-2">

                                                    {item.status !== 'In Progress' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(item._id, 'In Progress')}
                                                            className="rounded-full border border-cyan-500 px-3 py-1.5 text-xs font-semibold text-cyan-600 transition-all hover:bg-cyan-50">
                                                            In Progress
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleUpdateStatus(item._id, 'Completed')}
                                                        className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-700">
                                                        Complete
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

            {/* =====================================================
                SERVICES TAB
            ====================================================== */}
            {activeTab === 'services' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                    {services.map((svc) => (
                        <div
                            key={svc._id}
                            className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >

                            {/* Service Image */}
                            <div className="relative">
                                <img
                                    src={svc.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'}
                                    className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={svc.name}
                                />

                                <span className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur-sm">
                                    ${svc.price}
                                </span>
                            </div>

                            {/* Service Content */}
                            <div className="flex h-full flex-col p-5">

                                <small className="mb-2 flex items-center gap-1 text-gray-500">
                                    ⏱ {svc.duration} mins
                                </small>

                                <h5 className="mb-2 text-lg font-bold text-gray-900">
                                    {svc.name}
                                </h5>

                                <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-500">
                                    {svc.description}
                                </p>

                                <div className="mt-auto border-t border-gray-100 pt-3">
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                                        {svc.category}
                                    </span>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}