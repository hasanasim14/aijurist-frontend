"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  console.log("The authToken is", authToken);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navigationItems = [
    { label: "Home", href: "/docs" },
    { label: "How It Works", href: "/docs" },
    { label: "Plans", href: "/docs" },
    { label: "FAQ", href: "/docs" },
  ];

  const authItems = [
    { label: "Login", href: "/login" },
    { label: "Signup", href: "/signup" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/docs" className="z-50 relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="h-auto w-auto max-h-8"
            />
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            {authToken && (
              <Link
                href="/"
                className="group/item relative text-lg font-medium text-gray-500 hover:text-black transition-colors"
              >
                Go to Chat
                <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-400 ease-in-out group-hover/item:w-full" />
              </Link>
            )}
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group/item relative text-lg font-medium text-gray-500 hover:text-black transition-colors"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-400 ease-in-out group-hover/item:w-full" />
              </Link>
            ))}
            {!authToken &&
              authItems.map((item, index) => (
                <Link
                  key={`auth-${index}`}
                  href={item.href}
                  className="group/item relative text-lg font-medium text-gray-500 hover:text-black transition-colors"
                >
                  {item.label}
                  <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-400 ease-in-out group-hover/item:w-full" />
                </Link>
              ))}
          </nav>

          {/* Mobile Menu Button with transition */}
          <button
            className="z-50 md:hidden p-2 relative w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6">
              {/* Hamburger Icon */}
              <span
                className={`absolute block w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 top-[11px]" : "top-1"
                }`}
              ></span>
              <span
                className={`absolute block w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100 top-[11px]"
                }`}
              ></span>
              <span
                className={`absolute block w-6 h-0.5 bg-black transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 top-[11px]" : "top-5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from merging with fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
