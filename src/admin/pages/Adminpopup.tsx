import { useEffect, useState } from "react";
import axios from "axios";

interface Popup {
  id: number;
  message: string;
  active: boolean;
  created_at: string;
}

export default function Adminpopup() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);

  const fetchPopups = async () => {
    try {
      const res = await axios.get("https://dmv-e-learning-1.onrender.com/admin/popup/all");
      setPopups(res.data.data);
    } catch (error) {
      console.error("Fetch popups error:", error);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const submitPopup = async () => {
    if (!message.trim()) {
      alert("Message required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("https://dmv-e-learning-1.onrender.com/admin/popup", { message });
      setMessage("");
      fetchPopups();
    } catch (error) {
      console.error("Save popup error:", error);
      alert("Failed to save popup message");
    } finally {
      setLoading(false);
    }
  };

  const activatePopup = async (id: number) => {
    await axios.put(`https://dmv-e-learning-1.onrender.com/admin/popup/activate/${id}`);
    fetchPopups();
  };

  const deactivatePopup = async (id: number) => {
    await axios.put(`https://dmv-e-learning-1.onrender.com/admin/popup/deactivate/${id}`);
    fetchPopups();
  };

  const deletePopup = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this popup?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`https://dmv-e-learning-1.onrender.com/admin/popup/${id}`);
      fetchPopups();
    } catch (error) {
      console.error("Delete popup error:", error);
      alert("Failed to delete popup");
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  
  {/* ===== CREATE POPUP ===== */}
  <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg p-5">
    <h2 className="text-xl font-bold mb-4 text-center">
      Popup Message
    </h2>

    <textarea
      className="form-control border p-2 w-full mb-4 rounded"
      placeholder="Enter popup message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={4}
    />

    <button
      onClick={submitPopup}
      disabled={loading}
      className={`w-full py-2 rounded text-white ${
        loading
          ? "bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? "Saving..." : "Save Message"}
    </button>
  </div>

</div>

    {/* POPUP LIST */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg p-4 mb-3">
        <h3 className="text-lg font-bold mb-4">
          All Popup Messages
        </h3>

        {popups.length === 0 ? (
          <p className="text-gray-500">No popup messages found.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id}>
                  <td className="p-2 border">{popup.message}</td>

                  <td className="p-2 border">
                    {popup.active ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-2 border space-x-2 flex justify-between">
                    {popup.active ? (
                      <button
                        onClick={() => deactivatePopup(popup.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activatePopup(popup.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => deletePopup(popup.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
