import {
  Award,
  Bell,
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  ShoppingCart,
  Users,
  Video
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import FAQ from "../components/FAQ.jsx";
import Footer from "../components/Footer.jsx";
import NewsMarquee from "../components/NewsMarquee.jsx";
import ServiceCard from "../components/ServiceCard.jsx";



// This is the main page of the Swastha Bharat Portal, showcasing services, features, and more.
// It includes a header, hero section, services, features, FAQ, footer, and chatbot for user interaction.
const Index = () => {
  const navigate = useNavigate();



  const services = [
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      title: "Book an Appointment",
      description: "Schedule appointments with healthcare professionals directly through our portal.",
      color: "emerald",
      path: '/book'
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      title: "Order Medicine",
      description: "Browse and order government-approved medicines with ease.",
      color: "blue",
      path: '/order'

    },
    {
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Find Medicine Updates",
      description: "Stay updated on the latest medications approved by the government.",
      color: "purple",
      path: 'https://www.cdsco.gov.in/opencms/opencms/en/consumer/List-Of-Banned-Drugs/'
    },
    {
      icon: <Bell className="w-6 h-6 text-white" />,
      title: "Set Dose Reminder",
      description: "Never miss a dose with our intelligent reminder system.",
      color: "indigo",
      path: '/404'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: "24*7 Chatbot Service",
      description: "Get instant help and support from our AI-powered chatbot.",
      color: "teal",
      path: '/'

    },
    {
      icon: <Video className="w-6 h-6 text-white" />,
      title: "Video Conferencing",
      description: "Connect with healthcare providers through secure video calls.",
      color: "cyan",
      path: '/404'

    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Access Government Medicines Easily",
      description: "Effortlessly browse through a comprehensive database of government-approved medicines. Stay updated on the latest medications approved by the government and those that are banned to make informed decisions about your health."
    },
    {
      icon: <Heart className="w-8 h-8 text-emerald-400" />,
      title: "Personalized Prescriptions for Your Needs",
      description: "Receive personalized prescriptions tailored to your specific disease details and symptoms. Our advanced AI algorithms analyze your health information to recommend the most suitable medications approved by the government."
    },
    {
      icon: <MapPin className="w-8 h-8 text-emerald-400" />,
      title: "Find Nearby Stores with Ease",
      description: "Locate nearby pharmacies and medical stores effortlessly using our geolocation feature. Discover the nearest stores offering the medications prescribed to you, ensuring quick and convenient access to essential drugs."
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-400" />,
      title: "Never Miss a Dose Again",
      description: "Say goodbye to missed medication doses with our reminder system. Receive timely reminders according to your prescription, ensuring you stay on track with your treatment plan and maintain optimal health."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-400" />,
      title: "Book Appointments Hassle-Free",
      description: "Schedule appointments with healthcare professionals directly through our portal. Whether you prefer in-person consultations or telemedicine appointments, booking your visit has never been easier."
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-400" />,
      title: "Take Charge of Your Health Today",
      description: "Join us in our mission to promote a healthier nation. Sign up for Swastha Bharat Portal today and take control of your health journey. Together, let's build a healthier and happier future for all."
    }
  ];
  if (localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to Swastha Bharat Portal
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Empowering your journey to wellness, one click at a time
            </p>
            <p className="text-lg text-emerald-400 mb-12">
              - Swastha Mitra, where health meets care
            </p>

            <NewsMarquee />
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Comprehensive healthcare solutions at your fingertips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <RouterLink to={service.path}  key={index}><ServiceCard

                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  color={service.color}
                /></RouterLink>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Salient Features</h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                At Swastha Bharat Portal, we are dedicated to ensuring the well-being of every individual by providing seamless access to essential healthcare services. Our platform is designed to empower you with knowledge, convenience, and personalized care, all at your fingertips.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <Footer />

        {/* Chatbot */}
        {/* <ChatBot /> */}
      </div>
    );
  } else {
    navigate('/login');
    return null;
  }
};

export default Index;
