// components/Footer.tsx
import { Mail, MapPin, Phone } from "lucide-react";
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
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:Info@thealjurist.com"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                Info@thealjurist.com
              </a>
            </li>
            <li>
              <a
                href="tel:+922132636705"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                +92 21 32636705
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps?q=24.822373606227973, 67.02648637302957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition"
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                Plot D, 38, Block 5 Clifton, Karachi
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center gap-4">
          <span>© 2025 AI Legal Search. All rights reserved.</span>
          <a
            href="/refund_privacy"
            className="hover:text-gray-700 hover:underline"
          >
            Refund Policy
          </a>
          <a
            href="/service_policy"
            className="hover:text-gray-700 hover:underline"
          >
            Service Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
