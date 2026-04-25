import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function LivePlayer({ classId }: { classId: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      fluid: true,
      sources: [
        {
          src: `http://localhost:8000/live/class_${classId}.flv`,
          type: "video/x-flv"
        }
      ]
    });

    return () => {
      player.dispose();
    };
  }, [classId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
}
