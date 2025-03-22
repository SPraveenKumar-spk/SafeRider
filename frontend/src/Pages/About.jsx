import {
  FaShieldAlt,
  FaMotorcycle,
  FaFileInvoiceDollar,
  FaGlobe,
  FaUsers,
  FaRoad,
} from "react-icons/fa";
import aboutImage from "../assets/about.jpg";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const AboutSafeRider = () => {
  return (
    <>
      <Header />
      <section className="bg-white pt-30 py-16 px-6 md:px-12 lg:px-24 text-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold text-teal-600">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              SafeRider is a cutting-edge AI-powered solution that ensures road
              safety by detecting helmet violations, automating fine processing,
              and providing real-time updates to users.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: FaShieldAlt,
                  title: "AI-Powered Safety",
                  text: "Advanced detection for helmet violations.",
                },
                {
                  icon: FaMotorcycle,
                  title: "Automated Tracking",
                  text: "Smart monitoring for real-time enforcement.",
                },
                {
                  icon: FaFileInvoiceDollar,
                  title: "Transparent Fines",
                  text: "Clear and fair penalty system.",
                },
                {
                  icon: FaGlobe,
                  title: "Global Reach",
                  text: "Designed for cities worldwide.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-blue-100 p-5 rounded-xl shadow-md"
                >
                  <feature.icon className="text-4xl text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src={aboutImage}
              alt="SafeRider About"
              className="w-full rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutSafeRider;
