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

// // components/Footer.tsx
// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
//       <div className="max-w-7xl mx-auto">
//         {/* Main Footer Content */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
//           {/* Quick Links Column */}
//           <div className="col-span-1">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
//               Quick Links
//             </h3>
//             <ul className="space-y-3">
//               {["Plans", "Login", "Sign Up", "FAQ"].map((item) => (
//                 <li key={item}>
//                   <Link
//                     href="#"
//                     className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
//                   >
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Resources Column */}
//           <div className="col-span-1">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
//               Resources
//             </h3>
//             <ul className="space-y-3">
//               {[
//                 "How It Works",
//                 "Contact Us",
//                 "Privacy Policy",
//                 "Terms of Service",
//               ].map((item) => (
//                 <li key={item}>
//                   <Link
//                     href="#"
//                     className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
//                   >
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Us Column */}
//           <div className="col-span-2 md:col-span-1">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
//               Contact Us
//             </h3>
//             <ul className="space-y-3">
//               <li>
//                 <a
//                   href="mailto:Info@thealjurist.com"
//                   className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-start"
//                 >
//                   <svg
//                     className="h-5 w-5 mr-2 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Info@thealjurist.com
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="tel:+922132636705"
//                   className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-start"
//                 >
//                   <svg
//                     className="h-5 w-5 mr-2 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                     />
//                   </svg>
//                   +92 21 32636705
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Copyright Section */}
//         <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
//           <p className="text-xs text-gray-500 text-center">
//             © {new Date().getFullYear()} AI Legal Search. All rights reserved.
//           </p>
//           <div className="mt-4 flex space-x-6">
//             {["Twitter", "Facebook", "LinkedIn"].map((item) => (
//               <a
//                 key={item}
//                 href="#"
//                 className="text-gray-400 hover:text-indigo-600"
//               >
//                 <span className="sr-only">{item}</span>
//                 <svg
//                   className="h-5 w-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   {/* Social icons would go here */}
//                 </svg>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
