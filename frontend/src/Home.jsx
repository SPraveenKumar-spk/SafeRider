import Header from "./Components/Header";
import Image from "./assets/HomeImage.jpg";
import { NavLink } from "react-router-dom";
import {
  FaCamera,
  FaCreditCard,
  FaUserShield,
  FaPlayCircle,
  FaClipboardCheck,
  FaMoneyCheckAlt,
  FaEnvelopeOpenText,
  FaUserCheck,
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaCogs,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Footer from "./Components/Footer";

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("how-it-works");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    {
      icon: <FaPlayCircle className="text-5xl text-blue-500" />,
      title: "Capture Image",
      description: "AI-powered system captures the rider's image.",
    },
    {
      icon: <FaClipboardCheck className="text-5xl text-teal-500" />,
      title: "Helmet Detection",
      description: "System detects whether a helmet is worn or not.",
    },
    {
      icon: <FaUserCheck className="text-5xl text-indigo-500" />,
      title: "Fetch User Details",
      description: "License plate recognition retrieves user details.",
    },
    {
      icon: <FaMoneyCheckAlt className="text-5xl text-yellow-500" />,
      title: "Fine Processing",
      description:
        "If no helmet is detected, a fine is generated automatically.",
    },
    {
      icon: <FaEnvelopeOpenText className="text-5xl text-purple-500" />,
      title: "Notification Sent",
      description: "User receives an email with fine details and proof image.",
    },
  ];
  const testimonials = [
    {
      name: "John Doe",
      feedback: "SafeRider has revolutionized traffic safety!",
    },
    {
      name: "Jane Smith",
      feedback: "A much-needed solution for road safety enforcement.",
    },
    {
      name: "Michael Brown",
      feedback: "Quick and transparent fine processing.",
    },
    {
      name: "Emily Davis",
      feedback: "Highly recommend SafeRider for modern traffic systems!",
    },
    {
      name: "Robert Wilson",
      feedback: "AI-powered detection is fast and efficient.",
    },
    {
      name: "Sarah Johnson",
      feedback: "Easy to use and keeps our roads safer.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does SafeRider detect helmet violations?",
      answer:
        "SafeRider uses AI-powered image recognition to detect whether a rider is wearing a helmet or not.",
    },
    {
      question: "How do I pay my fine?",
      answer:
        "You can pay your fine online using our secure payment gateway available on the portal.",
    },
    {
      question: "Can I check my past violations?",
      answer:
        "Yes, once logged in, you can view your violation history and payment records.",
    },
    {
      question: "How accurate is the license plate recognition?",
      answer:
        "SafeRider uses advanced OCR technology to accurately capture and process license plate numbers.",
    },
    {
      question: "Will I get a notification for violations?",
      answer:
        "Yes, an email notification with proof of violation and fine details will be sent to your registered email.",
    },
  ];
  return (
    <>
      <section>
        <Header />
      </section>

      <section className="relative">
        <div className="absolute top-[40%] md:top-[30%] left-2 md:left-50 md:w-[40%] w-[60%] ">
          <h2 className="text-base md:text-3xl text-slate-700 text-center leading-relaxed font-semibold">
            AI-Powered Road Safety: Detect Violations Instantly!
          </h2>
          <div className="text-center pt-1 md:pt-10">
            <NavLink to="/login">
              <button className="text-md md:text-2xl py-1 px-2 md:py-3 md:px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition duration-300">
                Get Started
              </button>
            </NavLink>
          </div>
        </div>
        <div className="pt-20">
          <img
            src={Image}
            className="object-contain md:object-cover w-full h-full  md:w-screen md:h-[615px]"
            alt="Road Safety"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-5 md:py-10 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-indigo-700">
            Key Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 shadow-lg rounded-xl flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition duration-300">
            <FaCamera className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Live Detection
            </h3>
            <p className="text-gray-600">
              Real-time helmet detection using AI-powered vision systems to
              ensure rider safety.
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition duration-300">
            <FaCreditCard className="text-5xl text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Easy Fine Payment
            </h3>
            <p className="text-gray-600">
              Secure online payment integration for quick and hassle-free fine
              settlements.
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition duration-300">
            <FaUserShield className="text-5xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              User Verification
            </h3>
            <p className="text-gray-600">
              Secure authentication for users to check and manage their
              violation history.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-gradient-to-r from-blue-400 to-purple-500  py-5 md:py-10 md:px-2 text-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">How It Works</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center max-w-6xl mx-auto mt-12 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <motion.div
                className="bg-white p-6 shadow-lg rounded-xl flex flex-col items-center text-center border border-gray-200 text-gray-900 w-56"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                {step.icon}
                <h3 className="text-xl font-semibold mt-4 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className="my-4 md:mx-4 flex justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                >
                  <FaArrowRight className="text-white text-4xl md:block hidden" />
                  <FaArrowRight className="text-white text-4xl md:hidden block rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-5 md:py-16 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-green-600">
            Why Choose SafeRider?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <FaBolt className="text-5xl text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Faster Violation Detection
              </h3>
              <p className="text-gray-600">
                AI-driven automation ensures real-time helmet violation
                detection.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <FaChartLine className="text-5xl text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Transparent Fine System
              </h3>
              <p className="text-gray-600">
                Users receive real-time updates about fines with complete
                transparency.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <FaCogs className="text-5xl text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Ensuring Road Safety
              </h3>
              <p className="text-gray-600">
                AI-powered enforcement promotes safer roads and responsible
                riding.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-5 md:py-16 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-indigo-700">
            Testimonials
          </h2>
        </div>
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="max-w-4xl h-60 mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide
              key={index}
              className="p-6 bg-white shadow-lg rounded-xl text-center flex flex-col justify-center hover:shadow-2xl transition duration-300"
            >
              <FaUserCircle className="text-6xl text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-700 text-lg italic flex-grow">
                "{testimonial.feedback}"
              </p>
              <h3 className="text-xl font-semibold mt-4 text-indigo-700">
                - {testimonial.name}
              </h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section className="bg-white py-5 md:py-16 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-purple-700">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl p-2 border-gray-200 shadow-sm hover:shadow-md transition duration-300"
            >
              <button
                className="flex justify-between w-full py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <FaChevronDown
                  className={`text-gray-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}

export default Home;
