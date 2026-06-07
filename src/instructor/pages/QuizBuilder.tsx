import { useState, useEffect } from "react";
import { Trash } from "lucide-react";



//types
type Question = {
  question: string;
  options: string[];
  correctIndex: number | null;
};

type Quiz = {
  name: string;
  questions: Question[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowTabSwitch: boolean;
};



//components
export default function QuizManager() {
  const emptyQuiz: Quiz = {
    name: "",
    shuffleQuestions: false,
    shuffleOptions: false,
    allowTabSwitch: false,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: null,
      },
    ],
  };

  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(emptyQuiz);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [allowTabSwitch, setAllowTabSwitch] = useState(false);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");



  useEffect(() => {
    fetch("http://localhost:3000/admin/quiz/courses")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCourses(json.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
      });
  }, []);



  


  //Quiz Name
  const updateQuizName = (value: string) => {
    setCurrentQuiz({ ...currentQuiz, name: value });
  };

  //Qs Handler
  const addQuestion = () => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: [
        ...currentQuiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctIndex: null,
        },
      ],
    });
  };

  const updateQuestion = (qIndex: number, value: string) => {
    const questions = [...currentQuiz.questions];
    questions[qIndex].question = value;
    setCurrentQuiz({ ...currentQuiz, questions });
  };

  const updateOption = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const questions = [...currentQuiz.questions];
    questions[qIndex].options[optIndex] = value;
    setCurrentQuiz({ ...currentQuiz, questions });
  };

  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    const questions = [...currentQuiz.questions];
    questions[qIndex].correctIndex = optIndex;
    setCurrentQuiz({ ...currentQuiz, questions });
  };

  //save & update
  const saveQuiz = async () => {
    if (!durationMinutes || durationMinutes <= 0) {
      alert("Please set quiz duration (in minutes)");
      return;
    }

    if (!currentQuiz.name.trim()) {
      alert("Quiz name is required");
      return;
    }
    if (!selectedCourseId) {
      alert("Please select a course for this quiz");
      return;
    }


    for (let q of currentQuiz.questions) {
      if (!q.question.trim() || q.correctIndex === null) {
        alert("Fill all questions properly");
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:3000/admin/save-ai-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: currentQuiz.name,
          shuffleQuestions,
          shuffleOptions,
          allowTabSwitch,
          fullscreenRequired: true,
          durationMinutes,
          questions: currentQuiz.questions,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Quiz save failed");
        return;
      }

      alert("Quiz saved to database");

      setCurrentQuiz(emptyQuiz);
      setSavedQuizzes([]);

    } catch (err) {
      console.error(err);
      alert("Server error while saving quiz");
    }
  };


  //edit
  const editQuiz = (index: number) => {
    const quiz = savedQuizzes[index];
    setCurrentQuiz(quiz);
    setShuffleQuestions(quiz.shuffleQuestions);
    setShuffleOptions(quiz.shuffleOptions);
    setAllowTabSwitch(quiz.allowTabSwitch);
    setEditIndex(index);
  };

  //delete
  const deleteQuiz = (index: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    setSavedQuizzes(savedQuizzes.filter((_, i) => i !== index));
  };

  const handleAIUpload = async (file?: File) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("shuffleQuestions", String(shuffleQuestions));
  formData.append("shuffleOptions", String(shuffleOptions));


  setLoading(true);

  try {
    const res = await fetch("http://localhost:3000/admin/generate-quiz", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error("Quiz generation failed:", json);
      alert(json.message || "Quiz generation failed");
      return;
    }

    // SAFE STATE UPDATE
    setEditIndex(null);
    setCurrentQuiz({
      name: json.data.quizName || "AI Generated Quiz",
      shuffleQuestions,
      shuffleOptions,
      allowTabSwitch,
      questions: json.data.questions.map((q: any) => ({
        question: q.question ?? "",
        options:
          Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ["", "", "", ""],
        correctIndex:
          typeof q.correctIndex === "number" &&
          q.correctIndex >= 0 &&
          q.correctIndex < 4
            ? q.correctIndex
            : null,
      })),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Network error while generating quiz");
  } finally {

    setLoading(false);
  }
};



  /*UI*/
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 pt-4">
      {/*QUIZ BUILDER*/}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 p-5">
        <h1 className="text-3xl font-bold text-purple-600">
          {editIndex !== null ? "Edit Quiz" : "Create Quiz"}
        </h1>

        {/*Ai Quiz uploader */}
        <label
          className="
            flex items-center justify-between
            w-full
            px-4 py-3
              border-2 border-dashed border-purple-400
            rounded-full
            cursor-pointer
            hover:bg-purple-50
            transition
            mb-6
          "
        >
          <span className="text-gray-500 text-sm truncate">
            Upload quiz file (PDF / DOCX / TXT)
          </span>

          <span className="
            bg-purple-600
            text-white
            px-4 py-1.5
            rounded-full
            text-sm
          ">
            Browse
          </span>

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleAIUpload(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {loading && (
          <p className="text-sm text-gray-500 mt-1">
            Generating quiz from file...
          </p>
        )}



        {/* Quiz Name */}
        <input
          type="text"
          className="w-full p-3 border rounded mb-6 form-control"
          placeholder="Enter Quiz Name"
          value={currentQuiz.name}
          onChange={(e) => updateQuizName(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">

          <div>
            <label className="block text-sm font-medium mb-1">
              Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="w-full p-3 border rounded"
            >
              <option value="">Select Course for this Quiz</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quiz Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quiz Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 30"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full p-3 border rounded"
            />
          </div>
        </div>
        
        <div className="flex gap-6 items-center mt-2">
        {/* Shuffle Questions */}
          <div
            onClick={() => {
              const value = !shuffleQuestions;
              setShuffleQuestions(value);
              setCurrentQuiz({ ...currentQuiz, shuffleQuestions: value });
            }}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
              shuffleQuestions ? "bg-green-500" : "bg-gray-300"
            }`}
          >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
              shuffleQuestions ? "translate-x-7" : ""
            }`}
          />
          </div>
          <span className="text-sm">Shuffle Questions</span>

          {/* Shuffle Options */}
          <div
            onClick={() => {
              const value = !shuffleOptions;
              setShuffleOptions(value);
              setCurrentQuiz({ ...currentQuiz, shuffleOptions: value });
            }}

            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
              shuffleOptions ? "bg-green-500" : "bg-gray-300"
            }`}
          >
          <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                shuffleOptions ? "translate-x-7" : ""
              }`}
            />
          </div>
          <span className="text-sm">Shuffle Options</span>
        </div>

        {/* Allow Tab Switch */}
        <div className="flex items-center gap-3 mt-3">
          <div
            onClick={() => {
              const value = !allowTabSwitch;
              setAllowTabSwitch(value);
              setCurrentQuiz({ ...currentQuiz, allowTabSwitch: value });
            }}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
              allowTabSwitch ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                allowTabSwitch ? "translate-x-7" : ""
              }`}
            />
          </div>

          <span className="text-sm">
            Allow tab switch in this quiz
          </span>
        </div>
        {/* Questions */}
        {currentQuiz.questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border p-4 rounded space-y-3 mb-2 relative"
          >
            <button
              type="button"
              onClick={() => {
                const questions = currentQuiz.questions.filter(
                  (_, i) => i !== qIndex
                );
                setCurrentQuiz({ ...currentQuiz, questions });
              }}
              title="Delete Question"
              className="
                absolute bottom-3 right-3
                h-7 w-7
                flex items-center justify-center
                rounded-md
                bg-red-50 text-red-600
                hover:bg-red-600 hover:text-white
                transition
              "
            >
              <Trash className="h-3.5 w-3.5" />
            </button>

            <input
              type="text"
              className="w-full p-2 border rounded mb-2 form-control"
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, e.target.value)}
            />

            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="flex gap-2 items-center m-3">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctIndex === optIndex}
                  onChange={() => setCorrectAnswer(qIndex, optIndex)}
                  className=""
                />
                <input
                  type="text"
                  className="flex-1 p-2 border rounded form-control"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, e.target.value)
                  }
                />
              </label>
            ))}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={addQuestion}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            + Add Question
          </button>

          <button
            onClick={saveQuiz}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {editIndex !== null ? "Update Quiz" : "Save Quiz"}
          </button>
        </div>
      </div>

      {/* ===================== SAVED QUIZZES ===================== */}
      {savedQuizzes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Saved Quizzes</h2>

          {savedQuizzes.map((quiz, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 bg-white shadow p-"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{quiz.name}</h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => editQuiz(index)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuiz(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded "
                  >
                    Delete
                  </button>
                </div>
              </div>

              {quiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-3">
                  <p className="font-medium">
                    Q{qIndex + 1}. {q.question}
                  </p>
                  <ul className="ml-4">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          q.correctIndex === i
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {opt}
                        {q.correctIndex === i && " ✅"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
