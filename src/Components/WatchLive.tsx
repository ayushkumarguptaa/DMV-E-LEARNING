import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'

const WatchLive = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamURL = "https://dmv-e-learning-1.onrender.com/live/class1/index.m3u8";

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamURL);
      hls.attachMedia(videoRef.current!);

      return () => hls.destroy();
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamURL;
    }
  }, []);

  return (
<>
<Navbar/>
<div style={{ padding: "20px" }}>
      <h2>Live Class</h2>
      <video ref={videoRef} controls autoPlay width="80%" />
    </div>
<Footer/>
</>
  );
};

export default WatchLive;
