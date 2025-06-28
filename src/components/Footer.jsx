
const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-4">About Us</h3>
            <p className="text-slate-400 leading-relaxed">
              We are committed to providing quality healthcare services to our patients.
              Empowering your journey to wellness, one click at a time.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-slate-400">
                <span className="font-medium">Email:</span><a href="mailto:info@swasthabharat.com"> info@swasthabharat.com</a>
              </p>
              <p className="text-slate-400">
                <span className="font-medium">Phone:</span> +918767488109
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="http://www.facebook.com" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Facebook
              </a>
              <a href="http://www.x.com" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Twitter
              </a>
              <a href="http://www.linkedin.com/in/om-kadu-53305425a" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors">
                LinkedIn
              </a>
              <a href="http://www.instagram.com" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 Swastha Bharat Medical Portal. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
