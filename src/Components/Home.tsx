import {useEffect, useState} from 'react'
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'
import '../index.css'
import TopCourses from '../Utilities/TopCourses'
import Community  from '../Utilities/community'
import WhyDmv from '../Utilities/WhyDmv'
import HowItWork from '../Utilities/HowITtWork'
import InternshipCategories from '../Utilities/InternshipCategory'
import Testimonial from '../Utilities/Testimonial'
import Article from '../Utilities/Articles&news'
import axios from 'axios'
import Popup from '../Components/Pop'

function Home(){

  const [totalStudents, setTotalStudents] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
  axios
    .get("https://dmv-e-learning-1.onrender.com/user/ratings/count")
    .then(res => {
      console.log("Ratings:", res.data);
      setTotalRatings(res.data.total_ratings);
    })
    .catch(err => console.error(err));
}, []);



  useEffect(() => {
  axios
    .get("https://dmv-e-learning-1.onrender.com/user/enrolled-users/count")
    .then(res => setTotalStudents(res.data.totalUsers))
    .catch(err => console.error(err));
}, []);

  const [totalCourses, setTotalCourses] = useState(0)

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://dmv-e-learning-1.onrender.com/user/get-courses')

      console.log(res.data)
      setTotalCourses(res.data.count)

    } catch (error) {
      console.error('Error fetching courses', error)
    }
  }

  fetchCourses()
}, [])


    return(
        <>
            <Navbar/>
            <Popup/>

            <section className="w-full bg-[#D7ECFF]">

  {/*section*/}
  <div className="min-h-screen flex items-center relative z-10">
    <div className="w-full px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* LEFT CONTENT */}
      <div className=" p-5">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3A4B] leading-tight">
          <span className="text-blue-600">DMV:</span> Connecting <br />
          Academia with Industry.
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl text-lg">
          Unlock your potential with DMVquiz's innovative solution and expert
          guidance with tailored trainings, internships, jobs, hackathons & more.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <a href="/courses">
            <button className="bg-[#2D3A4B] text-white px-6 py-3 viewcourses hover:bg-[#1f2a36] transition p-3">
            View All Courses
          </button>
          </a>

          <a href="/quiz">
          <button className="bg-white text-[#2D3A4B] px-6 py-3 viewquiz rounded-full border border-gray-300 hover:bg-gray-100 transition p-3">
            View All Quizzes
          </button>
          </a>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="relative flex justify-center items-center">

        {/* Rating Badge */}
        <div className="absolute left-0 top-1/3 bg-white rounded-2xl shadow-lg px-4 py-3 z-20 flex items-center gap-2">
          {/* <span className="text-yellow-400 text-lg">★★★★★</span> */}
          {/* <span className="text-gray-500 text-sm">5300+ Rating</span> */}
        </div>

        {/* Secondary Card */}
        <div className="absolute left-8 bottom-0 w-44 h-60 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-400">
          <img src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA2L3Jhd3BpeGVsb2ZmaWNlN19waG90b19vZl95b3VuZ19pbmRpYW5fYm95X2hvbGRpbmdfc3R1ZGVudF9iYWNrcF9mMTgzNzMwYy00ZDdmLTRlNzUtOGE1MC1iZmFkNTI5MjMyYjFfMS5qcGc.jpg" alt="" className='w-[25em]'/>
        </div>

        {/* Main Card */}
        <div className="relative w-72 md:w-80 lg:w-96 h-[440px] bg-white rounded-3xl shadow-xl flex items-center justify-center">
          <span className="text-gray-400">
            <img src="https://www.ascm.org/globalassets/ascm_website_assets/img/2-5-how-do-i-apply-block.jpg" alt="" className='w-[25em] rounded-3xl '/>
          </span>

          {/* <div className="absolute bottom-6 -right-6 bg-white px-4 py-3 rounded-xl shadow flex items-center gap-3"> */}
            {/* <div className="bg-blue-100 p-2 rounded-lg text-xl">💻</div> */}
            {/* <div> */}
              {/* <p className="font-bold text-gray-800">7100+</p> */}
              {/* <p className="text-sm text-gray-500">Free Courses</p> */}
            {/* </div> */}
          {/* </div> */}
        </div>

      </div>
    </div>
  </div>

  {/* ================= STATS SECTION (OVERLAP) ================= */}
  <div className="bg-white py-16 -mt-24 relative z-20 pt-4 pb-4">
    <div className="max-w-7xl mx-auto px-6 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex justify-between">

      {/* Card 1 */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 text-center pt-4 w-[20em]">
        <div className="w-14 h-14 mx-auto bg-[#2D3A4B] text-white rounded-full flex items-center justify-center text-xl">
          📘
        </div>
        <h3 className="mt-4 text-3xl font-bold text-[#2D3A4B]">{totalCourses}+</h3>
        <p className="text-gray-500 mt-2">Online Courses</p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 text-center pt-4 w-[20em]">
        <div className="w-14 h-14 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-xl">
          👨‍🎓
        </div>
        <h3 className="mt-4 text-3xl font-bold text-[#2D3A4B]">{totalStudents}+</h3>
        <p className="text-gray-500 mt-2">Students Enrolled</p>
      </div>

      {/* Card 3 */}
      {/* <div className="bg-white rounded-2xl shadow-lg border p-8 text-center pt-4">
        <div className="w-14 h-14 mx-auto bg-orange-400 text-white rounded-full flex items-center justify-center text-xl">
          🌍
        </div>
        <h3 className="mt-4 text-3xl font-bold text-[#2D3A4B]">126+</h3>
        <p className="text-gray-500 mt-2">Countries Student</p>
      </div> */}

      {/* Card 4 */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 text-center pt-4 w-[20em]">
  <div className="w-14 h-14 mx-auto bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl">
    ❤️
  </div>
  <h3 className="mt-4 text-3xl font-bold text-[#2D3A4B]">
    {totalRatings}+
  </h3>
  <p className="text-gray-500 mt-2">Positive Feedback</p>
</div>


    </div>
  </div>

</section>
{/* INTERNSHIP */}

<div className="w-full bg-white py-20 pt-5 pb-5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT CARD */}
          <div className="relative border border-blue-200 rounded-2xl p-12 flex items-center justify-between overflow-hidden p-4" id='leftcard' >
            
            {/* Text */}
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-gray-900 leading-snug mb-6">
                Apply For Internship & Gain <br />
                Real Word experience.
              </h2>

              <p className="text-gray-600 mb-8">
                Engage them with fun learning, creativity, <br />
                and growth at home! 🚀
              </p>

              <button className="bg-slate-700 text-white font-medium hover:bg-slate-800 transition rightcard p-2">
                Get Started
              </button>
            </div>

            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80"
              alt="Internship"
              className="hidden md:block w-56 object-contain"
            />
          </div>

          {/* RIGHT CARD */}
          <div className="relative bg-slate-700 rounded-2xl p-12 flex items-center justify-between overflow-hidden p-4" id='rightcard'>
            
            {/* Text */}
            <div className="max-w-md text-white">
              <h2 className="text-4xl font-bold leading-snug mb-6">
                Enroll Into a Course & Boost <br />
                Your Skills to next level.
              </h2>

              <p className="text-slate-200 mb-8">
                Safe, engaging and designed to learn, <br />
                create and grow! 🚀
              </p>

              <a href="/courses">
              <button className="bg-white text-slate-700 rounded-full font-medium hover:bg-gray-100 transition cardleft p-2">
                Get Started
              </button></a>
            </div>

            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
              alt="Course"
              className="hidden md:block w-56 object-contain"
            />
          </div>

        </div>
      </div>
    </div>
    {/* TOP COURSES */}

      <TopCourses/>
      <Community/>
      <WhyDmv/>
      <HowItWork/>
      <InternshipCategories/>
      <Testimonial/>
      <Article/>



            {/*  */}
            <Footer/>
        </>
    )
}

export default Home