import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../Utilities/Navbar";
import Footer from "../Utilities/Footer";

export default function QuizPage() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [answers, setAnswers] = useState<
    { questionId: number; selectedIndex: number }[]
  >([]);

  const question = questions[current];
  const allAnswered = answers.length === questions.length;

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (quiz?.fullscreen_required && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [quiz]);


  useEffect(() => {
    fetch(`https://dmv-e-learning-1.onrender.com/user/quiz/${quizId}/start`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          alert(json.message);
          return;
        }

        let qs = json.data.questions;

        if (json.data.shuffle_questions) {
          qs = [...qs].sort(() => Math.random() - 0.5);
        }

        if (json.data.shuffle_options) {
          qs = qs.map((q: any) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          }));
        }

        setQuiz(json.data);
        setQuestions(qs);

        if (json.data.duration_minutes) {
          setTimeLeft(json.data.duration_minutes * 60);
        }
      });
  }, [quizId]);


  useEffect(() => {
    if (timeLeft === null || submitted || isSubmitting) return;

    if (timeLeft <= 0) {
      setTimerExpired(true);
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev! - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted, isSubmitting]);


  useEffect(() => {
    if (!quiz || quiz.allow_tab_switch) return;

    let warned = false;

    const handleVisibility = () => {
      if (document.hidden && !warned) {
        warned = true;
        alert("⚠️ Tab switching is not allowed!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [quiz]);


  const handleNext = () => {
    setSelected(null);
    setCurrent((c) => c + 1);
  };

  const handleSubmit = useCallback(async () => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("https://dmv-e-learning-1.onrender.com/user/quiz/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message);
        setIsSubmitting(false);
        return;
      }

      setScore(json.data.score);
      setSubmitted(true);
    } catch {
      alert("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, answers, submitted, isSubmitting]);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed</h1>
        <a href="/quiz/view/result" className="viewcourses ">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
  {/* <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg> */}
  <span>Click to see result</span>
</button>
      </a>
        <p className="text-xl">
          Score: <b>{score} / {questions.length}</b>
        </p>
        {timerExpired && (
          <p className="text-sm text-gray-500 mt-2">
            ⏱ Time expired. Quiz auto-submitted.
          </p>
        )}
      </div>
    );
  }

  if (!quiz) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!questions.length)
    return <p className="text-center mt-10">No questions found</p>;

  /* ================= UI ================= */
  return (
    <>
      {!isFullscreen && <Navbar />}

      <div className="max-w-3xl mx-auto p-6 mt-5 mb-5">
        <h1 className="text-3xl font-bold text-center mb-6">
          {quiz.title}
        </h1>

        {timeLeft !== null && (
          <span className="text-lg font-semibold text-red-600">
            ⏱ {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        )}

        <div className="bg-white shadow rounded-xl p-5 mt-4">
          <p className="font-semibold text-lg mb-4">
            Q{current + 1}. {question.question}
          </p>

          <div className="space-y-3">
            {question.options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  setSelected(idx);
                  setAnswers((prev) => {
                    const found = prev.find(
                      (a) => a.questionId === question.id
                    );
                    if (found) {
                      return prev.map((a) =>
                        a.questionId === question.id
                          ? { ...a, selectedIndex: idx }
                          : a
                      );
                    }
                    return [
                      ...prev,
                      { questionId: question.id, selectedIndex: idx },
                    ];
                  });
                }}
                className={`w-full px-4 py-2 rounded-lg border text-left
                  ${
                    selected === idx
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-gray-500">
              Question {current + 1} of {questions.length}
            </span>

            {current === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={
                  submitted || isSubmitting || selected === null || !allAnswered
                }
                className="p-2 mt-2 bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selected === null}
                className="p-2 mt-2 bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {!isFullscreen && <Footer />}
    </>
  );
}
