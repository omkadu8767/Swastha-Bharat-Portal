import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';



const initialState = {
    name: '',
    number: '',
    email: '',
    date: '',
    time: '',
    info: '',
};

const Book = () => {
    const host = import.meta.env.VITE_API;
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [appointment, setAppointment] = useState([]);


    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.number.match(/^[0-9]{10,15}$/)) errs.number = "Enter a valid mobile number (10-15 digits)";
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email";
        if (!form.date) errs.date = "Date is required";
        if (!form.time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i)) errs.time = "Enter time in HH:MM or HH:MM AM/PM format";
        return errs;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();

        // Check if the selected date already has an appointment
        const isDateTaken = appointment.some(
            appt => new Date(appt.date).toDateString() === new Date(form.date).toDateString()
        );
        if (isDateTaken) {
            toast.error("An appointment already exists for this date.", { position: "top-right", autoClose: 2000 });
            setErrors({ ...errs, date: "An appointment already exists for this date." });
            return;
        }

        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        // Set default info if empty
        const formToSend = {
            ...form,
            info: form.info && form.info.trim() !== "" ? form.info : "Patient Booking Appointment for General Checkup."
        };
        try {
            const response = await fetch(`${host}/api/book/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Assuming you store the token in localStorage
                },
                body: JSON.stringify(formToSend)
            });
            const appointmentData = await response.json();
            setAppointment(prev => [...prev, appointmentData]);
            setForm(initialState); // Reset form after submit
            setSubmitted(true);
            toast.success("Appointment Booked Successfully", { position: "top-right", autoClose: 2000 });
            await getAppointments(); // To refresh from server
            await fetchUser(); // To refresh user data

        } catch (error) {
            toast.error("Booking Failed", { position: "top-right", autoClose: 2000 });
            console.error("Booking failed:", error);
        }
    };

    // get all appointments
    const getAppointments = async () => {
        const response = await fetch(`${host}/api/book/appointments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token') // Assuming you store the token in localStorage
            },
        });
        const json = await response.json();
        setAppointment(json);
    };

    // Fetch user data
    const fetchUser = async () => {
        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Assuming you store the token in localStorage
                }
            });
            const data = await response.json();
            if (data.name) {
                setForm(prev => ({ ...prev, name: data.name, email: data.email }));
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        getAppointments();
    }, []);



    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4 py-10">
                    <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg">
                        <h1 className="text-3xl font-bold text-white mb-4 text-center">Book My Appointment</h1>
                        <p className="text-slate-400 mb-8 text-center">
                            Fill in your details to book an appointment with our healthcare professionals.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-slate-300 mb-1" htmlFor="name">Name</label>
                                <input
                                    className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <span className="text-red-400 text-sm">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1" htmlFor="number">Mobile Number</label>
                                <input
                                    className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    type="tel"
                                    id="number"
                                    name="number"
                                    value={form.number}
                                    placeholder='Enter 10 Digit Mobile Number'
                                    onChange={handleChange}
                                    required
                                    minLength={10}
                                    maxLength={15}
                                    pattern="[0-9]{10,15}"
                                />
                                {errors.number && <span className="text-red-400 text-sm">{errors.number}</span>}
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1" htmlFor="email">Email</label>
                                <input
                                    className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-300 mb-1" htmlFor="date">Date</label>
                                    <input
                                        className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.date && <span className="text-red-400 text-sm">{errors.date}</span>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-slate-300 mb-1" htmlFor="time">Time</label>
                                    <input
                                        className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        type="text"
                                        id="time"
                                        name="time"
                                        placeholder="HH:MM or HH:MM AM/PM"
                                        value={form.time}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.time && <span className="text-red-400 text-sm">{errors.time}</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1" htmlFor="info">Info</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    id="info"
                                    name="info"
                                    placeholder="Any additional information or special requests"
                                    value={form.info}
                                    onChange={handleChange}
                                    rows={2}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Book Appointment
                            </button>
                        </form>

                    </div>
                    <div className="flex ">
                        <div className="flex-row max-w-2xl mx-auto mt-8 mb-8 ">
                            <h2 className="text-2xl font-bold text-white mb-4">My Appointments</h2>
                            {appointment.length === 0 ? (
                                <div className="text-slate-400">No appointments found.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {appointment.map((appt, idx) => (
                                        <div
                                            key={appt._id ? appt._id : `appt-${idx}`}
                                            className="bg-slate-800 rounded-lg p-4 shadow border border-slate-700 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <div className="text-lg font-semibold text-emerald-400">{appt.name}</div>
                                            <div className="text-slate-300"><b>Mobile</b>: {appt.number}</div>
                                            <div className="text-slate-300"><b>Email</b>: {appt.email}</div>
                                            <div className="text-slate-300"><b>Date</b>: {new Date(appt.date).toLocaleDateString()}</div>
                                            <div className="text-slate-300"><b>Time</b>: {appt.time}</div>
                                            <div className="text-slate-300"><b>Info</b>: {appt.info}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Book;