const LiveStream = () => {
  const streamKey = "class1";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Instructor Live Broadcasting</h2>

      <p><b>OBS Server:</b> rtmp://localhost/live</p>
      <p><b>Stream Key:</b> {streamKey}</p>

      <p>Open OBS → Settings → Stream and use above details.</p>
      <p>Click "Start Streaming" in OBS to go live.</p>
    </div>
  );
};

export default LiveStream;
