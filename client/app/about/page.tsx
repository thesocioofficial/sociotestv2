"use client";

import React from "react";
import Footer from "../_components/Home/Footer";
import Link from "next/link";
import FAQSection from "../_components/Home/FAQs";

const AboutPage = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#154CB3]"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      title: "Event Discovery",
      description:
        "Easily find workshops, cultural fests, hackathons, and more happening across your campus.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#154CB3]"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: "Simple Registrations",
      description:
        "Sign up for events in just a few clicks—no more confusing forms or missed deadlines.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#154CB3]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      title: "Organizer Tools",
      description:
        "Give event organizers the space and tools to promote their events effectively and reach the right audience.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#154CB3]"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          <path d="M12 2c-3 0-5 2-5 5v1h10V7c0-3-2-5-5-5z"></path>
        </svg>
      ),
      title: "One Unified Platform",
      description:
        "Say goodbye to scattered WhatsApp messages and social media posts—everything’s in one place.",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="bg-gradient-to-b from-[#063168] to-[#3D75BD] text-white">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
          <div className="max-w-3xl text-left">
            <h1 className="text-3xl md:text-4xl font-black mb-3">
              About SOCIO
            </h1>
            {/* UPDATED Hero Text */}
            <p className="text-lg md:text-xl mb-8 text-[#ffffff]">
              Socio is a platform that brings every college event under one
              roof, helping students stay connected with everything happening on
              campus.
            </p>
            <p className="text-base md:text-lg mb-8 opacity-80 hidden md:block">
              We started Socio with one goal in mind: to remove the fear of
              missing out and help students experience the full spectrum of
              college life.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center w-auto bg-[#FFCC00] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#ffcc00eb] transition-all"
            >
              Explore events
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-5 w-5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src="https://img.recraft.ai/R9V1N4wvzo_EimtRVqMjVa7KCIAFxiGxa2YemSCmSSA/rs:fit:1365:1024:0/q:95/g:no/plain/abs://prod/images/f3f393ab-fbbb-4d73-b254-07373aa12e21@jpg"
              alt="Students using SOCIO platform"
              className="rounded-lg shadow-lg w-full" // Added shadow
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-black text-[#154CB3] mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-6">
              We started Socio with one goal in mind: to remove the fear of
              missing out and help students experience the full spectrum of
              college life.
            </p>
            <p className="text-gray-700 text-base md:text-lg mb-6">
              By creating a centralized platform, we’re making student life more
              connected, inclusive, and exciting—where no one misses out just
              because they didn’t get the memo.
            </p>
            <div className="bg-yellow-50 border-l-4 border-[#FFCC00] p-4 rounded">
              <p className="italic text-sm md:text-base text-gray-700">
                "SOCIO has transformed how our university community connects and
                engages with campus events, creating a more vibrant and
                inclusive student experience."
              </p>
              <p className="mt-2 text-sm md:text-base font-medium text-[#154CB3]">
                — Sachin Yadav
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-black text-[#154CB3] mb-6 text-center">
            What we offer
          </h2>
          <p className="text-gray-700 text-base md:text-lg mb-12 text-center max-w-3xl mx-auto">
            SOCIO provides a comprehensive suite of tools to enhance your campus
            experience, making it easier to discover, participate, and organize.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all border-b-4 border-[#FFCC00] flex flex-col"
              >
                <div className="mb-1 sm:mb-2 md:mb-4">{feature.icon}</div>
                <h3 className="text-[0.8rem] sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-1">
                  {" "}
                  {feature.title}
                </h3>
                <p className="text-xs leading-snug sm:text-xs md:text-sm lg:text-base text-gray-600 hidden md:block">
                  {feature.description}
                </p>
                <p className="text-xs leading-snug text-gray-600 md:hidden mt-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-black text-[#154CB3] mb-6 text-center">
          Our Impact
        </h2>
        <p className="text-gray-700 text-base md:text-lg mb-12 text-center max-w-3xl mx-auto">
          Socio was born from a simple idea pitched by Meeth during a college
          competition—and it resonated. Joined by Surya and Sachin, the team
          turned it into a reality. Today, Socio aims to help students across
          campuses stay informed, engaged, and connected with their college
          communities like never before.
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border-t-4 border-[#FFCC00]">
            <div className="flex justify-center mb-1 sm:mb-2 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#FFCC00]"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="text-base sm:text-xl md:text-3xl font-bold text-[#154CB3]">
              4+
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
              Campuses
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border-t-4 shadow-sm border-[#FFCC00]">
            <div className="flex justify-center mb-1 sm:mb-2 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#FFCC00]"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="text-base sm:text-xl md:text-3xl font-bold text-[#154CB3]">
              20K+
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
              Students
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border-t-4 shadow-sm border-[#FFCC00]">
            <div className="flex justify-center mb-1 sm:mb-2 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-14 lg:w-14 text-[#FFCC00]"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="text-base sm:text-xl md:text-3xl font-bold text-[#154CB3]">
              1K+
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
              Teachers
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-black text-[#154CB3] mb-6 text-center">
            Share Your Feedback
          </h2>
          <p className="text-gray-700 text-base md:text-lg mb-12 text-center max-w-3xl mx-auto">
            We're constantly improving SOCIO based on your suggestions and
            experiences.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg border-2 border-gray-200">
            {" "}
            <form>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm md:text-base font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154CB3]"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm md:text-base font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154CB3]"
                  placeholder="Enter your college email"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm md:text-base font-medium mb-2"
                >
                  Message/Query
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154CB3]"
                  placeholder="Type your message/query"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto hover:border-[#154cb3df] hover:bg-[#154cb3df] transition-all duration-200 ease-in-out cursor-pointer font-semibold px-6 py-2.5 my-4 mt-2 border-2 border-[#154CB3] text-sm rounded-full text-white bg-[#154CB3]"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#063168] to-[#3D75BD] text-white mb-8">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-6">
            Ready to get started with SOCIO?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto text-gray-300">
            Join thousands of students already using SOCIO to discover events,
            connect with clubs, and enhance their campus experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {" "}
            <Link
              href="/discover"
              className="w-full sm:w-auto justify-center cursor-pointer font-semibold px-4 py-2 border-2 border-[#FFCC00] hover:bg-[#ffcc00f0] transition-all ease-in-out text-sm rounded-full text-[#1e1e1e] bg-[#ffcc00] flex items-center"
            >
              Explore events
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto justify-center cursor-pointer font-semibold px-4 py-2 border-2 border-[#fff] hover:bg-[#ffffff1a] transition-all ease-in-out text-sm rounded-full text-white flex items-center"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
