import { useEffect, useState } from 'react';

const host = "http://localhost:5000";

const getUserId = (userField) => {
    if (!userField) return "";
    if (typeof userField === "string") return userField;
    if (userField.$oid) return userField.$oid;
    if (userField._id) return userField._id.toString();
    return "";
};

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${host}/api/admin/users`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : data.users || []);
            } catch {
                setUsers([]);
            }
        };
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${host}/api/admin/appointments`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setAppointments(Array.isArray(data) ? data : []);
            } catch {
                setAppointments([]);
            }
        };
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${host}/api/admin/orders`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch {
                setOrders([]);
            }
        };
        fetchUsers();
        fetchAppointments();
        fetchOrders();
    }, []);

    const handleUserClick = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    return (
        <div className="p-6 bg-slate-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-8 text-center text-emerald-400">Admin Dashboard - Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map(user => {
                    const userId = user._id.$oid ? user._id.$oid : user._id.toString();
                    const isExpanded = expandedUserId === userId;
                    return (
                        <div
                            key={userId}
                            className={`bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-slate-700 cursor-pointer hover:border-emerald-400 transition-all duration-300 ${isExpanded ? "ring-2 ring-emerald-400" : ""}`}
                            onClick={() => handleUserClick(userId)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-xl text-white">{user.name}</div>
                                    <div className="text-slate-400 text-sm">{user.email}</div>
                                </div>
                                <div className="text-emerald-400 text-2xl">
                                    {isExpanded ? <span>&#9650;</span> : <span>&#9660;</span>}
                                </div>
                            </div>
                            {isExpanded && (
                                <div className="mt-6 space-y-8">
                                    {/* Appointments */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Appointments</h3>
                                        {appointments.filter(appt => getUserId(appt.user) === userId).length === 0 ? (
                                            <div className="text-slate-400">No appointments found.</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {appointments
                                                    .filter(appt => getUserId(appt.user) === userId)
                                                    .map((appt, idx) => (
                                                        <div
                                                            key={appt._id?.$oid || appt._id || `appt-${idx}`}
                                                            className="bg-slate-900 rounded-lg p-4 shadow border border-slate-700 hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <div className="text-lg font-semibold text-emerald-400">{appt.name}</div>
                                                            <div className="text-slate-300"><b>Mobile:</b> {appt.number}</div>
                                                            <div className="text-slate-300"><b>Email:</b> {appt.email}</div>
                                                            <div className="text-slate-300"><b>Date:</b> {appt.date ? new Date(appt.date.$date || appt.date).toLocaleDateString() : "N/A"}</div>
                                                            <div className="text-slate-300"><b>Time:</b> {appt.time}</div>
                                                            <div className="text-slate-300"><b>Info:</b> {appt.info} </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Orders */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-400 mb-4">Orders</h3>
                                        {orders.filter(order => getUserId(order.user) === userId).length === 0 ? (
                                            <div className="text-slate-400">No orders found.</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders
                                                    .filter(order => getUserId(order.user) === userId)
                                                    .map((order, idx) => (
                                                        <div
                                                            key={order._id?.$oid || order._id || `order-${idx}`}
                                                            className="bg-slate-900 rounded-lg p-4 shadow border border-slate-700 hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <div className="text-lg font-semibold text-blue-400">{order.medicineName}</div>
                                                            <div className="text-slate-300"><b>Quantity:</b> {order.quantity}</div>
                                                            <div className="text-slate-300"><b>Address:</b> {order.address}</div>
                                                            <div className="text-slate-300"><b>Mobile:</b> {order.mobileNumber}</div>
                                                            <div className="text-slate-300"><b>Additional Info:</b> {order.additionalInfo}</div>
                                                            <div className="text-slate-300"><b>Order Date:</b> {order.orderDate ? new Date(order.orderDate.$date || order.orderDate).toLocaleString() : "N/A"}</div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}