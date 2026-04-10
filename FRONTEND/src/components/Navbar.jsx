import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-10 py-5 text-white">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                    ⚡
                </div>
                <span>
                    Dev<span className="text-purple-400">Connect</span>
                </span>
            </Link>

            {/* Links */}
            <ul className="hidden md:flex gap-8 text-gray-300">
                <li className="hover:text-white cursor-pointer transition">Features</li>
                <li className="hover:text-white cursor-pointer transition">How It Works</li>
                <li className="hover:text-white cursor-pointer transition">Mentors</li>
                <li className="hover:text-white cursor-pointer transition">Pricing</li>
            </ul>

            {/* Buttons */}
            <div className="flex items-center gap-4">

                {/* Sign In */}
                <Link to="/login">
                    <button className="text-gray-300 hover:text-white transition">
                        Sign In
                    </button>
                </Link>

                {/* Get Started */}
                <Link to="/register">
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                        Get Started Free
                    </button>
                </Link>

            </div>

        </nav>
    );
};

export default Navbar;