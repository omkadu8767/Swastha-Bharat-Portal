import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {
    const [user, setUser] = useState({ name: "", email: "" });
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const host = "http://localhost:5000";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);

    const ref = useRef(null)

    // Open modal with selected appointment
    const openEditModal = (appointment) => {
        setEditAppointment({ ...appointment }); // clone to avoid direct mutation
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditAppointment(null);
    };

    // Update appointment API call
    const handleUpdateAppointment = async () => {
        try {
            // Always fetch the latest appointments from the backend
            const res = await fetch(`${host}/api/book/appointments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            const allAppointments = await res.json();

            // Check for conflict (same date, different _id)
            // Compare only the date part
            const isConflict = Array.isArray(allAppointments) && allAppointments.some(
                (appt) =>
                    appt._id !== editAppointment._id &&
                    appt.date.slice(0, 10) === editAppointment.date.slice(0, 10)
            );

            if (isConflict) {
                toast.error("This date is already booked. Please choose another date.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }

            // Proceed to update
            const response = await fetch(`${host}/api/book/appointment/${editAppointment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    name: editAppointment.name,
                    number: editAppointment.number,
                    email: editAppointment.email,
                    date: editAppointment.date,
                    time: editAppointment.time,
                    info: editAppointment.info,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Optionally, refresh appointments after update
                fetchAppointments();
                toast.success("Appointment updated successfully", { position: "top-right", autoClose: 2000 });
                closeModal();
            } else {
                toast.error(data.message || "Failed to update appointment", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            toast.error("Unexpected error occurred while updating appointment.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };
    // Handle modal input changes
    const handleEditChange = (e) => {
        setEditAppointment({ ...editAppointment, [e.target.name]: e.target.value });
    };



    // Fetch user info
    const fetchUser = async () => {
        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            setUser({ name: data.name, email: data.email });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${host}/api/book/appointments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    // Fetch orders
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${host}/api/order/myorders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            // If data is an array, use it directly; if it's an object with orders, use data.orders
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]); // fallback to empty array
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${host}/api/book/appointment/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            let json;
            try {
                json = await response.json();
            } catch (error) {
                console.error("Invalid JSON response:", error);
                alert("An error occurred while processing the response. Please try again.");
                location.reload();
                throw new Error("The server returned an invalid response.");
            }

            if (response.ok) {
                // Remove from local state
                setAppointments((prev) => prev.filter((appt) => appt._id !== id));
                toast.success("Appointment deleted successfully", { position: "top-right", autoClose: 2000 });
            } else {
                console.error("Failed to delete the Appointment:", json.message || "Unknown error");
                toast.error(`Failed to delete: ${json.message || "Unknown error"}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("An error occurred while deleting the appointment:", error);
            toast.error("Unexpected error occurred while deleting appointment.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    useEffect(() => {
        fetchUser();
        fetchAppointments();
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-10">
            <div className="flex flex-col items-center mb-10">
                <Avatar className="w-28 h-28 mb-4">
                    <AvatarImage
                        src="https:/${host}/api.dicebear.com/7.x/bottts/svg?seed=profile"
                        alt="User avatar"
                        className="rounded-full"
                    />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name || "Your Name"}</h2>
                <p className="text-slate-400">{user.email || "your@email.com"}</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* My Appointments */}
                <div>
                    <h3 className="text-xl font-semibold text-emerald-400 mb-4">My Appointments</h3>
                    {appointments.length === 0 ? (
                        <div className="text-slate-400">No appointments found.</div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appt, idx) => (
                                <div
                                    key={appt._id ? appt._id : `appt-${idx}`}
                                    className="bg-slate-800 rounded-lg p-4 shadow border border-slate-700 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-lg font-semibold text-emerald-400">{appt.name}</div>
                                    <div className="text-slate-300"><b>Mobile:</b> {appt.number}</div>
                                    <div className="text-slate-300"><b>Email:</b> {appt.email}</div>
                                    <div className="text-slate-300"><b>Date:</b> {new Date(appt.date).toLocaleDateString()}</div>
                                    <div className="text-slate-300"><b>Time:</b> {appt.time}</div>
                                    <div className="text-slate-300"><b>Info:</b> {appt.info} </div>
                                    <div className="flex py-2 text-slate-300">
                                        <i className="fa-solid fa-trash-can text-red-500 cursor-pointer float-right" onClick={() => handleDelete(appt._id)} ></i>
                                        <i className="fa-solid fa-pen-to-square px-7 text-blue-500 cursor-pointer mx-2" onClick={() => openEditModal(appt)}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Orders */}
                <div>
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">My Orders</h3>
                    {orders.length === 0 ? (
                        <div className="text-slate-400">No orders found.</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, idx) => (
                                <div
                                    key={order._id ? order._id : `order-${idx}`}
                                    className="bg-slate-800 rounded-lg p-4 shadow border border-slate-700 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-lg font-semibold text-blue-400">{order.medicineName}</div>
                                    <div className="text-slate-300"><b>Quantity:</b> {order.quantity}</div>
                                    <div className="text-slate-300"><b>Address:</b> {order.address}</div>
                                    <div className="text-slate-300"><b>Mobile:</b> {order.mobileNumber}</div>
                                    <div className="text-slate-300"><b>Additional Info:</b> {order.additionalInfo}</div>
                                    <div className="text-slate-300"><b>Order Date:</b> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Edit Appointment Modal */}
            {isModalOpen && editAppointment && (
                <div
                    id="default-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 dark:bg-opacity-80"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Edit Appointment
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="p-4 md:p-5 space-y-4">
                                <form className="max-w-sm mx-auto" onSubmit={e => { e.preventDefault(); handleUpdateAppointment(); }}>
                                    <div className="mb-5">
                                        <label htmlFor="ename" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                        <input
                                            type="text"
                                            id="ename"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Name"
                                            name='name'
                                            value={editAppointment.name}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="enumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number</label>
                                        <input
                                            type="number"
                                            id="enumber"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder='Mobile Number'
                                            name='number'
                                            value={editAppointment.number}
                                            onChange={handleEditChange}
                                            minLength={10}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="eemail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input
                                            type="email"
                                            id="eemail"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder='Email'
                                            name='email'
                                            value={editAppointment.email}
                                            onChange={handleEditChange}
                                            minLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="edate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                        <input
                                            type="date"
                                            id="edate"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder='Date'
                                            name='date'
                                            value={editAppointment.date}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="etime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time</label>
                                        <input
                                            type="time"
                                            id="etime"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder='Time'
                                            name='time'
                                            value={editAppointment.time}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="einfo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Info</label>
                                        <input
                                            type="text"
                                            id="einfo"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder='Info'
                                            name='info'
                                            value={editAppointment.info}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="submit"
                                            className="text-white bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            disabled={editAppointment.name.length < 3 || editAppointment.email.length < 5}
                                        >
                                            Update Appointment
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            type="button"
                                            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;