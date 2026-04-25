import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'
import '../index.css'

export default function QuizCards() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/user/quizzes", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setQuizzes(json.data);
      });
  }, []);

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto pt-4">
      <div>
        <h1 className="text-3xl font-bold text-center mb-8">
        Choose a Quiz
      </h1>
      <a href="/quiz/view/result" className="viewcourses ">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
  {/* <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg> */}
  <span>View Results</span>
</button>
      </a>
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-4 pb-5">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="pt-5 pb-5 cursor-pointer bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-500 mt-2">
              Click to start
            </p>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}
