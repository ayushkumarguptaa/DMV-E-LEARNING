import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'

interface AttemptedQuiz {
  quiz_id: number;
  title: string;
  score: number;
  total_questions: number;
  percentage: number;
  status: string;
}

const AttemptedQuizzes = () => {
  const [quizzes, setQuizzes] = useState<AttemptedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttemptedQuizzes = async () => {
      try {
        const res = await axios.get(
          "https://dmv-e-learning-1.onrender.com/user/quizzes/attempted",
          { withCredentials: true }
        );

        if (res.data.success) {
          setQuizzes(res.data.quizzes);
        } else {
          setError("Failed to load attempted quizzes");
        }
      } catch (err) {
        setError("Unable to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedQuizzes();
  }, []);

  if (loading) return <p className="text-gray-500">Loading quizzes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto px-4 p-5">
      <h2 className="text-2xl font-bold mb-6">Attempted Quizzes</h2>

      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes attempted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.quiz_id}
              className="bg-white border rounded-xl p-5 shadow hover:shadow-md transition"
            >
              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-2">
                {quiz.title}
              </h3>

              {/* SCORE */}
              <div className="text-gray-700">
                <p>
                  Score:{" "}
                  <span className="font-semibold">
                    {quiz.score} / {quiz.total_questions}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  {quiz.percentage}% completed
                </p>
              </div>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full
                    ${
                      quiz.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  `}
                >
                  {quiz.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default AttemptedQuizzes;
