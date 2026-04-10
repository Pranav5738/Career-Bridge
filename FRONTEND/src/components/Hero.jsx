import React from "react";

const Hero = () => {
    return (
        <section className="text-center text-white px-6 mt-16">

            {/* Beta Tag */}
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-purple-900/40 text-sm border border-purple-700">
                Now in Public Beta · 15,000+ engineers enrolled
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Land Your <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Dream Tech Role
                </span>{" "}
                Faster
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
                Resume analysis, skill gap intelligence, mock interviews, and curated expert mentors —
                everything engineers need to break into top tech companies.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex justify-center gap-6 flex-wrap">
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:opacity-90">
                    Start Free Today →
                </button>
                <button className="text-white text-lg hover:underline">
                    Browse 500+ Mentors
                </button>
            </div>
        </section>
    );
};

export default Hero;