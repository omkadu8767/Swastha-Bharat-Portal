
const ServiceCard = ({ icon, title, description, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    teal: "bg-teal-600 hover:bg-teal-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700"
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 border border-slate-700">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      <button className={`mt-4 ${colorClasses[color]} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:shadow-lg`}>
        Learn More
      </button>
    </div>
  );
};

export default ServiceCard;
