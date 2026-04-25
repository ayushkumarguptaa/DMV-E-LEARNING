const HowItWorks = () => {
  return (
    <section className="w-full bg-white py-24 px-4 p-5">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            How it Works
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            When you sign up, you’ll immediately have unlimited viewing
            of thousands of expert courses.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT STEPS */}
          <div className="space-y-12">

            {/* STEP 1 */}
            <div className="flex gap-6 p-4">
              <div className=" flex items-center justify-center rounded-full bg-slate-800 text-white h-8 p-2">
                01
              </div>
              <div>
                <h5 className="text-xl font-semibold text-slate-900">
                  Register and Receive your Welcome Letter.
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Select your undesired desired role, explore the job profile,
                  and learn about company's prospects.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex gap-6 p-4">
              <div className="flex items-center justify-center rounded-full bg-slate-800 text-white h-8 p-2">
                02
              </div>
              <div>
                <h5 className="text-xl font-semibold text-slate-900 mb-2">
                  Complete Real work
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Engage in real-world scenarios under guidance of industry experts,
                  designed by companies & gain practical experiences.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex gap-6 p-4">
              <div className="flex items-center justify-center rounded-full bg-slate-800 text-white h-8 p-2">
                03
              </div>
              <div>
                <h5 className="text-xl font-semibold text-slate-900 mb-2">
                  Earn Work Experience certificate.
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  Showcase your work experience on your CV and LinkedIn
                  to catch the attention of recruiters.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://img.freepik.com/free-photo/people-working-as-team-company_23-2149136890.jpg?semt=ais_hybrid&w=740&q=80"
              alt="How it works"
              className="w-full max-w-md"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
