import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type ClassType = {
  id: number;
  title: string;
  pdf_notes?: string;
};

export default function UploadPdf() {
  const { id } = useParams(); // class id from URL
  const [cls, setCls] = useState<ClassType | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch class by ID
  const fetchClass = async () => {
    try {
      const res = await axios.get(
        `https://dmv-e-learning-1.onrender.com/instructor/class/${id}`
      );
      setCls(res.data.data);
    } catch (error) {
      console.error("Fetch class error:", error);
    }
  };

  useEffect(() => {
    fetchClass();
  }, [id]);

  // Upload PDF
  const uploadPdf = async () => {
    if (!pdfFile || !cls) {
      alert("Select a PDF file first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("pdf", pdfFile);

      await axios.post(
        `https://dmv-e-learning-1.onrender.com/instructor/upload-pdf/${cls.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("PDF uploaded successfully");
      setPdfFile(null);
      fetchClass(); // refresh class data
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cls) {
    return <p className="text-center mt-10">Loading class...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Upload PDF Notes
      </h2>

      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h3 className="text-xl font-bold text-center">{cls.title}</h3>

        {/* Upload PDF */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />

        <button
          onClick={uploadPdf}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        {/* Download PDF */}
        {cls.pdf_notes && (
          <a
            href={cls.pdf_notes}
            download
            target="_blank"
            className="block text-center bg-green-600 text-white py-2 rounded"
          >
            Download Notes
          </a>
        )}
      </div>
      <div>
        <a href="/instructor/live">
          <button>Go Live</button>
        </a>
      </div>
    </div>
  );
}
