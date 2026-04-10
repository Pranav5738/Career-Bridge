import React from "react";

const Stats = () => {
    return (
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white px-10">

            <div>
                <h2 className="text-3xl font-bold">15K+</h2>
                <p className="text-gray-400">Developers</p>
            </div>

            <div>
                <h2 className="text-3xl font-bold">500+</h2>
                <p className="text-gray-400">Mentors</p>
            </div>

            <div>
                <h2 className="text-3xl font-bold">94%</h2>
                <p className="text-gray-400">Interview Rate</p>
            </div>

            <div>
                <h2 className="text-3xl font-bold">$148K</h2>
                <p className="text-gray-400">Avg Offer</p>
            </div>

        </div>
    );
};

export default Stats;