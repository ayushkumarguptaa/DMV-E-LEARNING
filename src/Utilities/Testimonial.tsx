const testimonials = [
  {
    name: "Abishek S",
    image: "https://i0.wp.com/rollercoasteryears.com/wp-content/uploads/Thrive-During-Finals-.jpg?resize=1000%2C667&ssl=1",
    review: `Being an intern at Zidio was a transformative experience. 
    The real-world projects, professional development opportunities, 
    and inclusive work culture made it a perfect place to start my 
    professional journey.`,
  },
  {
    name: "Mamuni Panda",
    image: "https://t3.ftcdn.net/jpg/05/60/70/68/360_F_560706812_0GNEvn3tqo6OVQtE0JIvlwZx8fu6S2SR.jpg",
    review: `Zidio's internship program is second to none. The team is welcoming, 
    and I had the opportunity to work on exciting projects that truly made 
    an impact. I highly recommend it to anyone looking to grow their career.`,
  },
  {
    name: "Ritik Pratap Singh Patel",
    image: "https://img.freepik.com/free-photo/close-up-portrait-cute-young-woman-holding-textbook-colored-pencils-posing-studio-isolated-pink_176532-9674.jpg?semt=ais_hybrid&w=740&q=80",
    review: `I would like to extend my heartfelt thanks to Zidio Development for 
    the incredible support and mentorship throughout my internship period. 
    The guidance and encouragement from your team were invaluable.`,
  },
];

const Testimonials = () => {
  return (
    <section className="w-full bg-slate-50 p-5">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our Student <br /> Have To Say
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The world’s largest selection of courses choose from 130,000 online
            video courses with new additions published every month
          </p>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition p-5"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h4>

                  {/* STARS */}
                  <div className="flex text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                  </div>
                </div>
              </div>

              {/* REVIEW */}
              <p className="text-slate-700 leading-relaxed text-sm">
                “{item.review}”
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
