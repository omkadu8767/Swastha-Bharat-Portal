import { useState } from "react";
import { toast } from "react-toastify";

const Order = () => {
    const host = import.meta.env.VITE_API;
    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({
        medicineName: "",
        quantity: 1,
        address: "",
        mobileNumber: "",
        additionalInfo: ""
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Add item to cart
    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!form.medicineName.trim() || !form.quantity) return;
        setCart((prev) => [
            ...prev,
            { medicineName: form.medicineName, quantity: form.quantity }
        ]);
        toast.success("Item added to cart !", { position: "top-right", autoClose: 2000 });
        setForm((prev) => ({
            ...prev,
            medicineName: "",
            quantity: 1
        }));
    };

    // Razorpay payment handler
    const handlePayment = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        const amount = 100; // You can calculate total here

        const options = {
            key: "rzp_test_LN5SE3XfavXRvS",
            amount: amount * 100,
            currency: "INR",
            name: "Swatha Bharat Portal",
            description: "Payment for medicines",
            // image: {Logo},
            prefill: {
                name: "Om Kadu",
                email: "info@swasthabharat.com",
                contact: form.mobileNumber || "8767488109"
            },
            handler: async function (response) {
                toast.success("Payment successful!", { position: "top-right", autoClose: 2000 });

                try {
                    // Send each cart item as a separate order
                    for (const item of cart) {
                        const res = await fetch(`${host}/api/order/medicine`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "auth-token": localStorage.getItem('token') // Assuming you store the token in localStorage
                            },
                            body: JSON.stringify({
                                medicineName: item.medicineName,
                                quantity: item.quantity,
                                address: form.address,
                                mobileNumber: form.mobileNumber,
                                additionalInfo: form.additionalInfo,
                                paymentId: response.razorpay_payment_id
                            })
                        });
                        if (!res.ok) {
                            toast.error("Failed to place order for " + item.medicineName, { position: "top-right", autoClose: 2000 });
                        }
                    }
                    toast.success("Order(s) placed successfully!", { position: "top-right", autoClose: 2000 });
                    setCart([]);
                } catch (err) {
                    toast.error("Error connecting to server!", { position: "top-right", autoClose: 2000 });
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4 py-10">
                <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg">
                    <h1 className="text-3xl font-bold text-white mb-4 text-center">Order Medicine</h1>
                    {/* Cart Display */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-emerald-400 mb-2">Cart</h2>
                        {cart.length === 0 ? (
                            <div className="text-slate-400">No items in cart.</div>
                        ) : (
                            <ul className="list-disc list-inside text-slate-200">
                                {cart.map((item, idx) => (
                                    <li key={idx}>
                                        {item.quantity}x {item.medicineName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Order Form */}
                    <form className="space-y-5" onSubmit={handleAddToCart}>
                        <div>
                            <label className="block text-slate-300 mb-1" htmlFor="medicineName">Medicine Name</label>
                            <input
                                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                type="text"
                                id="medicineName"
                                name="medicineName"
                                value={form.medicineName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1" htmlFor="quantity">Quantity</label>
                            <input
                                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                type="number"
                                id="quantity"
                                name="quantity"
                                min={1}
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1" htmlFor="address">Address</label>
                            <textarea
                                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1" htmlFor="mobileNumber">Mobile Number</label>
                            <input
                                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                pattern="[0-9]{10,15}"
                                value={form.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1" htmlFor="additionalInfo">Additional Information</label>
                            <textarea
                                className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                id="additionalInfo"
                                name="additionalInfo"
                                value={form.additionalInfo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Add to Cart
                            </button>
                            <button
                                type="button"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                onClick={handlePayment}
                                disabled={cart.length === 0}
                                id="payButton"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Order;