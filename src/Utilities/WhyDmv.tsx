const WhyZidio = () => {
  return (
    <section className="bg-sky-100 py-24 p-5">
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION HEADING */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why DMV?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Here is short details about us, Also you can see how we work.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* LEFT – IMAGES */}
          <div className="relative flex justify-center">

            {/* Background circle */}
            <div className="absolute w-80 h-80 bg-slate-700 rounded-full -z-10" />

            {/* Top Image */}
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Student"
              className="w-72 rounded-2xl shadow-lg translate-x-12 -translate-y-10"
            />

            {/* Bottom Image */}
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Learning"
              className="w-80 rounded-2xl shadow-lg -translate-x-10 translate-y-10"
            />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition">
                ▶
              </button>
            </div>
          </div>

          {/* RIGHT – TEXT */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              India's #1 Platform For Training & Internships.
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover the future of professional development with DMV
              Learning, designed to bridge the gap between academic knowledge
              and real world industrial skills. Our platform offers
              comprehensive online training and internships, tailored to equip
              students and professionals with the expertise needed to excel in
              today's competitive job market.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you're looking to enhance your skills or gain hands-on
              experience, DMV provides a structured, industry-focused
              approach to learning, ensuring you're prepared for success in
              your chosen field.
            </p>

            {/* CHECKLIST */}
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-gray-700">
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-700">
                  ✓
                </span>
                Develop Real-Word Expertise.
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-700">
                  ✓
                </span>
                Enhance Your Career Opportunities.
              </li>
            </ul>

            {/* BUTTON */}
            <a href="/knowmore">
              <button className="bg-slate-700 text-white rounded-full font-medium hover:bg-slate-800 transition p-3 knowmore">
              Know More
            </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyZidio;
