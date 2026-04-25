import '../index.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#1E2448] text-white pt-20 w-full p-5">

      {/*TOP SECTION*/}
      <div className="w-full">
        <div className="px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-6">About</h3>
            <h4 className="text-xl font-semibold mb-3">Never Miss A Post!</h4>
            <p className="text-gray-300 mb-6">
              Choose the most powerful courses and always be on demand
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter e-mail Address"
                className="px-4 py-3 w-full text-black rounded-l-md focus:outline-none text-white"
              />
              <button className="bg-purple-600 font-semibold hover:bg-purple-700 transition p-3 subscribe">
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Support*/}
          <div>
            <h3 className="text-2xl font-bold mb-6">Support Zone</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Unlock Your Potential</li>
              <li>Privacy policy and cookie policy</li>
              <li>Sitemap</li>
              <li>Featured courses</li>
              <li>Join Us</li>
            </ul>
          </div>

          {/* Comp Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Company Info</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Get the app</li>
              <li>About us</li>
              <li>Contact us</li>
            </ul>
          </div>

          {/* Explore Services */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Explore Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Careers</li>
              <li>Blog</li>
              <li>Help and Support</li>
              <li>Terms</li>
              <li>Certificate Verification</li>
              <li>Free Course</li>
            </ul>
          </div>

        </div>
      </div>

      {/*GRADIENT BAR*/}
      <div className="mt-20 bg-gradient-to-r from-purple-700 to-pink-600 py-10 w-full mt-5 p-5">
        <div className="px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-0 items-center">



          {/* Call Us */}
          <div className="flex items-center gap-4 pr-2">

            <div className="text-4xl">🎧</div>
            <div>
              <p className="uppercase text-sm font-semibold">Call Us 24/7</p>
              <p className="text-2xl font-bold">+91 93040 82246</p>
            </div>
          </div>

          {/* Address */}
          <div className="pl-2">

            <p className="font-semibold">Horizon Tower, Silvassa, Dadra and Nagar haveli - 396230
India</p>
            <p className="underline">support@zidio.in</p>
          </div>

          {/* Follow + Payment */}
          <div className="flex gap-4">
            <div>
  <p className="font-bold mb-2 text-white">FOLLOW US</p>

  <div className="flex gap-4">
    <a
      href="https://www.facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition"
      aria-label="Facebook"
    >
      <FontAwesomeIcon icon={faFacebook} size="lg" />
    </a>

    <a
      href="https://www.twitter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition"
      aria-label="Twitter"
    >
      <FontAwesomeIcon icon={faTwitter} size="lg" />
    </a>

    <a
      href="https://www.linkedin.com"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition"
      aria-label="LinkedIn"
    >
      <FontAwesomeIcon icon={faLinkedin} size="lg" />
    </a>
  </div>
</div>
{/* payment */}
            <div className="max-w-full overflow-hidden">
  <p className="font-bold mb-2">PAYMENT METHOD</p>

  <div className="flex flex-nowrap gap-2 items-center text-xs">
    <span className="bg-white text-black px-2 py-1 rounded shrink-0">
      PayPal
    </span>
    <span className="bg-white text-black px-2 py-1 rounded shrink-0">
      Stripe
    </span>
    <span className="bg-white text-black px-2 py-1 rounded shrink-0">
      Paystack
    </span>
    <span className="bg-white text-black px-2 py-1 rounded shrink-0">
      Razorpay
    </span>
    <span className="bg-white text-black px-2 py-1 rounded shrink-0">
      Paytm
    </span>
  </div>
</div>
          </div>

        </div>
      </div>

      {/*COPYRIGHT*/}
      <div className="text-center py-6 text-gray-400 text-sm w-full mt-4">
        Copyright © 2026 designed & developed by team DMV Development,
        All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
