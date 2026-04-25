import { useState } from "react";

type PdfNote = {
  id: number;
  title: string;
  pdf_url: string;
};

export default function PdfNotesDummy() {
  // Dummy PDF data
  const [pdfs] = useState<PdfNote[]>([
    {
      id: 1,
      title: "MERN Stack Notes",
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      title: "React Basics",
      pdf_url: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      id: 3,
      title: "Node.js Guide",
      pdf_url: "https://www.orimi.com/pdf-test.pdf",
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
        Class PDF Notes
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">{pdf.title}</h3>
              <p className="text-sm text-gray-500">
                PDF Notes available for download
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              {/* View PDF */}
              <a
                href={pdf.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                View
              </a>

              {/* Download PDF */}
              <a
                href={pdf.pdf_url}
                download
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
