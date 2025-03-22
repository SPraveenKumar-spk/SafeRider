import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Contact = () => {
  return (
    <>
      <Header />
      <section className="bg-gray-100 pt-30 py-16 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-600 mb-6">
            Contact Us
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Have questions or need support? Reach out to us!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center ">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
            <FaPhone className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
            <p className="text-gray-600">+1 234 567 890</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
            <FaEnvelope className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
            <p className="text-gray-600">support@saferider.com</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center cursor-pointer">
            <FaMapMarkerAlt className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
            <p className="text-gray-600">123 Safe Road, Bangalore, India</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Send Us a Message
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
