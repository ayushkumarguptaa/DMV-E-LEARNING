import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Utilities/Navbar";
import Footer from "../Utilities/Footer";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

type Instructor = {
  id: number;
  name: string;
  specialization: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
};

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(
          "https://dmv-e-learning-1.onrender.com/admin/getinstructors"
        );
        setInstructors(res.data.data);
      } catch (error) {
        console.error("Fetch instructors error:", error);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <>
      <Navbar />

      <div className="w-full">
        {/* HERO */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 text-center">
          <h1 className="text-4xl font-bold">
            Start your Industry Journey with us
          </h1>
        </div>

        {/* INTRO */}
        <div className="text-center py-16">
          <p className="uppercase text-sm text-gray-500 font-semibold">
            Meet our world-class instructors
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 max-w-3xl mx-auto">
            We are here to meet your demand and teach in the most beneficial way
            for your personal growth.
          </h2>
        </div>

        {/* INSTRUCTORS GRID */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 px-4 pb-20">
          {instructors.map((instructor) => (
            <div
  key={instructor.id}
  className="group flex flex-col items-center w-full sm:w-[45%] md:w-[30%]"
>
  {/* AVATAR */}
  <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-gray-200">
    <img
      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      alt="Instructor"
      className="w-32 h-32"
    />

    {/* SOCIAL OVERLAY */}
    <div
      className="
        absolute inset-0 
        bg-black/60 
        flex items-center justify-center gap-5 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity duration-300
        z-10
      "
    >
      {instructor.github_url && (
        <a
          href={instructor.github_url}
          target="_blank"
          rel="noreferrer"
          className="bg-white p-3 rounded-full"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
      )}

      {instructor.linkedin_url && (
        <a
          href={instructor.linkedin_url}
          target="_blank"
          rel="noreferrer"
          className="bg-white p-3 rounded-full"
        >
          <FontAwesomeIcon icon={faLinkedinIn} size="lg" className="text-blue-600" />
        </a>
      )}

      {instructor.twitter_url && (
        <a
          href={instructor.twitter_url}
          target="_blank"
          rel="noreferrer"
          className="bg-white p-3 rounded-full"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" className="text-sky-500" />
        </a>
      )}
    </div>
  </div>

  {/* INFO */}
  <h3 className="mt-5 text-lg font-semibold text-center">
    {instructor.name}
  </h3>
  <p className="text-gray-600 text-sm text-center">
    {instructor.specialization}
  </p>
</div>

          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default InstructorsPage;
