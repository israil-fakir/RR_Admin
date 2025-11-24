import React from "react";
import people from "../../../assets/Analytics/people.png";
import medical from "../../../assets/Analytics/medical.png";
import timeLine from "../../../assets/Analytics/timeLine.png";
import money from "../../../assets/Analytics/money.png";

export default function Analytics() {
  return (
    <>
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
        Performance Analytics
      </h3>

      <p className="text-gray-600 text-sm md:text-base mb-4">
        Comprehensive insights and business trends through interactive visualizations.
      </p>

      {/* FULL WIDTH SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6
                   outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* CARD 1 */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4">
          <div>
            <p className="text-gray-600 text-sm">Active Clients</p>
            <h1 className="text-2xl font-bold">350</h1>

            {/* Modified Line */}
            <p className="text-sm">
              <span className="text-green-500 font-semibold">↑+8%</span>{" "}
              <span className="text-gray-600">vs last month</span>
            </p>
          </div>

          <div className="bg-[#E8F0FF] rounded-xl p-3 flex justify-center items-center">
            <img src={people} alt="people" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* CARD 2 */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4">
          <div>
            <p className="text-gray-600 text-sm">Completed Services</p>
            <h1 className="text-2xl font-bold">920</h1>

            {/* Modified Line */}
            <p className="text-sm">
              <span className="text-green-500 font-semibold">↑+15%</span>{" "}
              <span className="text-gray-600">vs last month</span>
            </p>
          </div>

          <div className="bg-[#E8F0FF] rounded-xl p-3 flex justify-center items-center">
            <img src={medical} alt="medical" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* CARD 3 */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4">
          <div>
            <p className="text-gray-600 text-sm">Avg. Response Time</p>
            <h1 className="text-2xl font-bold">2.3 hrs</h1>

            {/* Modified Line */}
            <p className="text-sm">
              <span className="text-green-500 font-semibold">↑+5%</span>{" "}
              <span className="text-gray-600">vs last month</span>
            </p>
          </div>

          <div className="bg-[#E8F0FF] rounded-xl p-3 flex justify-center items-center">
            <img src={timeLine} alt="timeline" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* CARD 4 */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4">
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <h1 className="text-2xl font-bold">$48,250</h1>

            {/* Modified Line */}
            <p className="text-sm">
              <span className="text-green-500 font-semibold">↑+12%</span>{" "}
              <span className="text-gray-600">vs last month</span>
            </p>
          </div>

          <div className="bg-[#E8F0FF] rounded-xl p-3 flex justify-center items-center">
            <img src={money} alt="money" className="w-8 h-8 object-contain" />
          </div>
        </div>

      </div>

      {/* ------------------------------ */}
      {/* TOP PERFORMING SERVICES TABLE */}
      {/* ------------------------------ */}

      <div className="mt-10 bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">
          Top Performing Services
        </h3>

        <p className="text-gray-500 text-sm mb-4">
          Revenue breakdown by service type
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Service</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Revenue ($)</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Orders</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Growth</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">1</td>
                <td className="py-3 px-4 text-gray-700">PPC Packages</td>
                <td className="py-3 px-4 text-gray-700">$15,600</td>
                <td className="py-3 px-4 text-gray-700">120</td>
                <td className="py-3 px-4 text-green-500 font-semibold">+20%</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">2</td>
                <td className="py-3 px-4 text-gray-700">Web Design</td>
                <td className="py-3 px-4 text-gray-700">$10,200</td>
                <td className="py-3 px-4 text-gray-700">95</td>
                <td className="py-3 px-4 text-green-500 font-semibold">+15%</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">3</td>
                <td className="py-3 px-4 text-gray-700">SEO Packages</td>
                <td className="py-3 px-4 text-gray-700">$8,570</td>
                <td className="py-3 px-4 text-gray-700">80</td>
                <td className="py-3 px-4 text-green-500 font-semibold">+18%</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">4</td>
                <td className="py-3 px-4 text-gray-700">Social Media</td>
                <td className="py-3 px-4 text-gray-700">$6,540</td>
                <td className="py-3 px-4 text-gray-700">60</td>
                <td className="py-3 px-4 text-green-500 font-semibold">+25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
