import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePopup() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/popup");

        if (res.data?.message) {
          setMessage(res.data.message);

          setTimeout(() => {
            setShow(true);
          }, 1000);
        }
      } catch (error) {
        console.error("Fetch popup error:", error);
      }
    };

    fetchPopup();
  }, []);

  if (!show || !message) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p className="text-lg">{message}</p>

        <button
          onClick={() => setShow(false)}
          className="btn btn-secondary btn-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
