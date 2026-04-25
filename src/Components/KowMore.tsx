import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'

const testimonials = [
  {
    name: "Abishek S",
    image: "/images/testimonial1.jpg",
    rating: 5,
    text:
      "My internship at Zidio was a fantastic experience. The real-world exposure and professional development helped me grow immensely.",
  },
  {
    name: "Mamuni Panda",
    image: "/images/testimonial2.jpg",
    rating: 5,
    text:
      "Zidio's internship program is second to none. The team is welcoming, and I worked on exciting projects that made an impact.",
  },
  {
    name: "Ritik Pratap Singh Patel",
    image: "/images/testimonial3.jpg",
    rating: 5,
    text:
      "The mentorship and guidance throughout my internship period were invaluable. A truly remarkable learning journey.",
  },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <section className="bg-[#0f172a] text-white py-20 p-5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn More About Us
          </h1>
          {/* <p className="text-gray-300">Home / About Us</p> */}
        </div>
      </section>

      <section className="py-20 border-1 m-5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-sm text-purple-600 font-semibold mb-2">
              Who We Are
            </h3>
            <h2 className="text-3xl font-bold mb-4">
              Improving lives through Learning
            </h2>
            <div className="text-gray-600 leading-relaxed p-3">
                <p >
              We are always inspired by the world and people around us.
              Celebrating e-learning excellence in personal and professional
              development. Our mission is to empower learners with industry-ready
              skills.
            </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white h-[100%] w-[100%] pt-5 ">
            <h3 className="text-2xl font-bold p-5">
              We are here to meet your demand Our goal is to train the next generation of creative professionals
              with real-world projects and expert mentors.
            </h3>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-2">100k+</h2>
            <p className="font-semibold">Most Involved Teachers</p>
            <p className="text-gray-600 mt-2">
              Building strong student relationships with patience, care, and
              knowledge.
            </p>

            <h2 className="text-5xl font-bold mt-10 mb-2">200+</h2>
            <p className="font-semibold">Large Selection of Courses</p>
            <p className="text-gray-600 mt-2">
              Industry-focused programs designed for modern careers.
            </p>
          </div>

          <img
            src="/images/about-student.jpg"
            alt="Student Learning"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/about1.jpg"
              className="rounded-xl"
              alt=""
            />
            <img
              src="/images/about2.jpg"
              className="rounded-xl"
              alt=""
            />
            <img
              src="/images/about3.jpg"
              className="rounded-xl col-span-2"
              alt=""
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-4">
              Build your own library for your career
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Whether you begin your journey on our platform or choose the
              flexibility of video learning, our courses are designed to help
              you along your path.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Client Testimonial</h2>
          <p className="text-gray-600 mb-12">
            The world's largest selection of online video courses.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h4 className="font-semibold">{item.name}</h4>
                <div className="text-yellow-400 my-2">
                  {"★".repeat(item.rating)}
                </div>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
