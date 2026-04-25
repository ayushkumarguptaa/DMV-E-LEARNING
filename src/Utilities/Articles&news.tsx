const newsList = [
  "New internship batches are now open for Web, Data & Design domains.",
  "DMV partners with industry experts to launch real-world projects.",
  "Students completing internships will now receive verified certificates.",
  "Monthly mentorship sessions introduced for all active interns.",
];

const NewsSection = () => {
  return (
    <section className="w-full bg-sky-200 p-5">
      <div className="max-w-5xl mx-auto text-center">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-10">
          Articles & News
        </h2>

        {/* NEWS LIST */}
        <div className="space-y-6">
          {newsList.map((news, index) => (
            <p
              key={index}
              className="text-lg text-slate-700 leading-relaxed"
            >
              • {news}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NewsSection;
