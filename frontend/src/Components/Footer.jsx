import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h2 className="text-2xl font-bold">SafeRider</h2>
          <p className="mt-2 text-gray-400">
            Ensuring road safety with AI-powered technology.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#about" className="hover:text-indigo-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-indigo-400">
                Key Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-indigo-400">
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-indigo-400">
                FAQs
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="mt-3 flex justify-center md:justify-start space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 text-2xl"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 text-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 text-2xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} SafeRider. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
