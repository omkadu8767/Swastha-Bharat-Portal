import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the purpose of this portal?",
      answer: "Swastha Bharat Portal is designed to provide seamless access to essential healthcare services, including government-approved medicines, personalized prescriptions, appointment booking, and dose reminders."
    },
    {
      question: "How do I access government medicines through this portal?",
      answer: "You can browse through our comprehensive database of government-approved medicines. Simply search for the medication you need, and our system will show you approved options along with nearby pharmacies that stock them."
    },
    {
      question: "How can I get personalized prescriptions based on my disease details?",
      answer: "Our advanced AI algorithms analyze your health information and symptoms to recommend the most suitable government-approved medications. Simply provide your disease details and symptoms through our secure form."
    },
    {
      question: "Are the prescriptions provided by this portal legally valid?",
      answer: "Our system provides medication recommendations based on government-approved drugs. However, for legal prescriptions, you should consult with licensed healthcare professionals through our appointment booking system."
    },
    {
      question: "How does the portal suggest nearby stores for purchasing medicines?",
      answer: "We use geolocation technology to identify your location and show nearby pharmacies and medical stores that stock the medications you need. You can view store details, contact information, and directions."
    },
    {
      question: "Can I trust the accuracy of the information provided on this portal?",
      answer: "Yes, all medication information is sourced from official government databases and regulatory authorities. We regularly update our database to ensure accuracy and compliance with current regulations."
    },
    {
      question: "How do reminders work on this portal?",
      answer: "Our intelligent reminder system sends timely notifications according to your prescription schedule. You can customize reminder frequency, timing, and delivery method (SMS, email, or app notifications)."
    },
    {
      question: "Is my personal information secure on this portal?",
      answer: "Absolutely. We implement industry-standard security measures to protect your personal and health information. All data is encrypted and stored securely in compliance with healthcare privacy regulations."
    },
    {
      question: "Is there any cost associated with using this portal?",
      answer: "Basic services like browsing medicines, setting reminders, and accessing health information are free. Some premium features like video consultations may have associated costs, which will be clearly displayed."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-lg">
            Get answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-700 rounded-lg border border-slate-600">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-600 transition-colors rounded-lg"
              >
                <span className="text-white font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;