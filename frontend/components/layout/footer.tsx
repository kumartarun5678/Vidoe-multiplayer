"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="bg-[#1E2A47] text-white py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-lg mt-1 sm:text-lg md:text-xl 2xl:text-2xl font-semibold mb-3">
            <img
              src="Tarun.png"
              alt="logo"
              height={10}
              width={10}
            />
          </h2>
        
          <div className="flex space-x-2 ">
            <Link href="https://x.com" target='_blank' className="p-2 cursor-pointer rounded-md bg-white hover:bg-gray-100 transition">

              <FaXTwitter className="text-black text-sm" />
            </Link>

            <Link href="http://linkedin.com" target='_blank'
              className="p-2 cursor-pointer rounded-md bg-white hover:bg-gray-100 transition">
              <FaLinkedinIn className="text-blue-700 text-sm" />
            </Link>

            <Link href="https://youtube.com" target='_blank'
              className="p-2 cursor-pointer rounded-md bg-red-600 hover:bg-red-700 transition">
              <FaYoutube className="text-white text-sm" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-lg md:text-xl 2xl:text-2xlfont-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-base sm:text-xs md:text-md 2xl:text-lg text-gray-300">
            <li>
              <Link href="/support/contact" className="hover:text-white  transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/support/refund-policy" className="hover:text-white  transition">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/support/privacy-policy" className="hover:text-white  transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/support/terms-and-conditions" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg sm:text-lg md:text-xl 2xl:text-2xlfont-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-base sm:text-xs md:text-md 2xl:text-lg text-gray-300">
            <li>
              <Link href="/support/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-white transition">
                Courses
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg sm:text-lg md:text-xl 2xl:text-2xl font-semibold mb-3">Get in Touch</h3>
          <ul className="space-y-2 text-base sm:text-xs md:text-md 2xl:text-lg text-gray-300">
            <li>Email: <a href="mailto:support@marketcanbetimed.com" className="hover:text-white">kumartarun5678@gmail.com</a></li>
            <li>Phone: +91 7250177460</li>
            <li>Mon - Fri: 9 AM - 6 PM (IST)</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-600 mt-8 mx-4 sm:mx-6 lg:mx-8" />

      <div className="text-center font-medium text-md sm:text-md md:text-md 2xl:text-lg text-gray-400 mt-6">
        © 2025 Tarun Kumar.
      </div>
    </footer>
  );
};

export default Footer;
