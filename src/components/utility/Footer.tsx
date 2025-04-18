// components/Footer.tsx
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links Column */}
        <div>
          <h3 className="text-gray-800 font-medium mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Plans
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h3 className="text-gray-800 font-medium mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div>
          <h3 className="text-gray-800 font-medium mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:Info@thealjurist.com"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Info@thealjurist.com
              </a>
            </li>
            <li>
              <a
                href="tel:+922132636705"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                +92 21 32636705
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        © 2025 AI Legal Search. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
