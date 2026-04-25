import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Components/Home";
import Courses from "./Components/Courses";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/Signup";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard"; // Dashboard page
// import Addcourse from "./admin/pages/AddCourse";
import TermsAndConditions from './Components/TermsAndConditions'
import PrivacyPolicy from "./Components/Privacy";
import Addinstructor from './admin/pages/AddInstructor'
import Instructors from './Components/Instructor'
// import Addquiz from './admin/pages/QuizBuilder'
import Contactus from './Components/Contactus'
import ClassesManager from "./admin/pages/ClassesManager";
import Classespage from './Components/Classespage'
import Quiz from './Components/QuizCard'
import TestQuiz from './Components/Quiz'
import CourseDetail from "./Components/CourseDetail";
import PreviewCourse from './admin/pages/CourseDeatails'
import Lecture from './Components/Lecture'
import InstructorDetails from './Components/InstructorDetails'
import CourseDetails from "./Components/CourseDetails";
import Knowmore from './Components/KowMore'
import QuizResult from './Components/AttemptedQuizzes'
import PopUp from './admin/pages/Adminpopup'
import Register from './instructor/pages/Register'
import InsLogin from './instructor/pages/Login'
import InsHome from './instructor/pages/Landing'
import ChangePass from './instructor/pages/ChangePass'
import About from './instructor/pages/About'
import InsDashboard from './instructor/pages/dashboard'
import AddClasses from './instructor/pages/AddClasses'
import InstructorLayout from './instructor/pages/InstrucotLayout'
import AddCourses from './instructor/pages/Courses'
import Course from "./admin/pages/AddCourse";
import GetStarted from './instructor/pages/GetStarted'
import AddQuizzes from './instructor/pages/QuizBuilder'
import Uploadpdf from './instructor/pages/UploadPdf'
import Notes from './Components/Notes'
import LiveStream from './instructor/pages/LiveStream'
import WatchLive from './Components/WatchLive'

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
<Route path="/" element={<Home />} />
<Route path="/courses" element={<Courses />} />
<Route path="/courses/:id" element={<CourseDetail />} />
<Route path="/Signin" element={<SignIn />} />
<Route path="/Signup" element={<SignUp />} />
<Route path="/terms" element={<TermsAndConditions />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/instructors" element={<Instructors />} />
<Route path="/contact" element={<Contactus />} />
<Route path="/classes" element={<Classespage />} />
<Route path="/quiz" element={<Quiz />} />
<Route path="/quiz/:quizId" element={<TestQuiz />} />
<Route path="/classes/lectures/:courseId" element={<Lecture />} />
<Route path="/courses/instructordetails" element={<InstructorDetails />} />
<Route path="/knowmore" element={<Knowmore />} />
<Route path="/quiz/view/result" element={<QuizResult />} />
<Route path="/notes" element={<Notes />} />
{/* User Live Watching Route */}
<Route path="/watch-live" element={<WatchLive />} />



        {/* Admin Routes*/}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="popup" element={<PopUp />} />
          <Route path="addcourse" element={<Course />} />
          <Route path="addinstructor" element={<Addinstructor />} />
          <Route path="classes" element={<ClassesManager />} />
          {/* <Route path="previewcourse/:courseId" element={<PreviewCourse />}/> */}
        </Route>


        {/* Instructor Auth Routes (No Navbar) */}
<Route path="/instructor/register" element={<Register />} />
<Route path="/instructor/login" element={<InsLogin />} />
<Route path="/instructor/change-password" element={<ChangePass />} />

{/* Instructor Pages with Navbar */}
<Route path="/instructor" element={<InstructorLayout />}>
  <Route index element={<InsHome />} />
  <Route path="about" element={<About />} />
  <Route path="dashboard" element={<InsDashboard />} />
  <Route path="add-classes" element={<AddClasses />} />
  <Route path="add-courses" element={<AddCourses />} />
  <Route path="previewcourse/:courseId" element={<PreviewCourse />}/>
  <Route path="getstarted" element={<GetStarted />} />
  <Route path="add-quizzes" element={<AddQuizzes />} />
  <Route path="classes/:id" element={<Uploadpdf />} /> 
  {/* LIVE STREAM ROUTE */}
  <Route path="live" element={<LiveStream />} />
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
