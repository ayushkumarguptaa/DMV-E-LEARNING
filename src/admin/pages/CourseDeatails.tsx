import { useRef, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../../index.css";

interface Video {
  id: number;
  title: string;
  url: string;
}

export default function CoursePage() {
  const [courseDescription, setCourseDescription] = useState<string>("");
  const { courseId } = useParams();
  const location = useLocation();

  const courseName = location.state?.courseName || "Course";

  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [uploading, setUploading] = useState(false); // 🔥 NEW

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  const fetchCourseDescription = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/user/get-courses"
      );

      const course = res.data.data.find(
        (c: any) => String(c.id) === String(courseId)
      );

      if (course) {
        setCourseDescription(course.description);
      }
    } catch (err) {
      console.error("Failed to fetch course description", err);
    }
  };

  fetchCourseDescription();
}, [courseId]);

  /*FETCH LECTURES*/
  const fetchLectures = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/admin/getlectures/${courseId}`
      );

      const formatted = res.data.data.map((item: any) => ({
        id: item.id,
        title: item.lecture_title,
        url: item.lecture_url,
      }));

      setVideos(formatted);

      if (formatted.length > 0) {
        setActiveVideo(formatted[0]);
      }
    } catch (error) {
      console.error("Failed to fetch lectures", error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  /*UPLOAD LECTURE*/
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) return;

    setUploading(true); // 🔥 START UPLOADING

    try {
      const formData = new FormData();
      formData.append("video", fileRef.current.files[0]);
      formData.append("course_id", String(courseId));

      const res = await axios.post(
        "http://localhost:3000/admin/upload-lecture",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newLecture: Video = {
        id: res.data.lecture.id,
        title: res.data.lecture.lecture_title,
        url: res.data.lecture.lecture_url,
      };

      setVideos((prev) => [...prev, newLecture]);
      setActiveVideo(newLecture);
      fileRef.current.value = "";
    } catch (error) {
      console.error("Upload failed", error);
      alert("Lecture upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="bg-slate-900 text-white px-6 py-4">
        <h1 className="text-3xl font-bold">
          {courseName} Video Lectures
        </h1>
        <p className="text-slate-300 text-sm">
          Course ID: {courseId}
        </p>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid md:grid-cols-12 gap-4">

        {/* VIDEO PLAYER */}
        <section className="md:col-span-8 bg-white p-4 rounded-xl shadow m-4">
          {activeVideo ? (
            <video
              src={activeVideo.url}
              controls
              className="w-full aspect-video bg-black rounded"
            />
          ) : (
            <div className="aspect-video border flex items-center justify-center">
              Select a lecture to play
            </div>
          )}

          {/* UPLOAD */}
          <form onSubmit={handleUpload} className="mt-4 space-y-2">
            <input
              type="file"
              ref={fileRef}
              accept="video/*"
              required
              disabled={uploading}
            />

            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 rounded text-white ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Lecture"}
            </button>
          </form>
        </section>

        {/* PLAYLIST */}
        <aside className="md:col-span-4 bg-white p-4 rounded-xl shadow m-4">
          <h2 className="font-bold mb-3">📂 Playlist</h2>

          {videos.length === 0 && (
            <p className="text-slate-500 text-sm">
              No lectures uploaded yet
            </p>
          )}

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className={`p-2 mb-2 cursor-pointer rounded ${
                activeVideo?.id === v.id
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              ▶ {v.title}
            </div>
          ))}
          
        </aside>
        
      </main>
      {/* COURSE DESCRIPTION */}
  {courseDescription && (
    <div className="mt-4 pt-3 p-4 ">
      <h3 className="font-semibold mb-1">📘 About this course</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {courseDescription}
      </p>
    </div>
  )}
    </div>
  );
}
