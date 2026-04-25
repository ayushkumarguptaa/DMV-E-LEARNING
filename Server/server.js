import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import NodeMediaServer from"node-media-server";
import User from "./Routes/user.js";
import Admin from "./Routes/admin.js";
import pool from "./config/db.js";
import Instructor from './Routes/instructor.js'

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "Server/uploads"))
);


pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ DB Connection Failed", err);
  } else {
    console.log("✅ PostgreSQL Connected", res.rows);
  }
});


app.use("/user", User);
app.use("/admin", Admin);
app.use("/instructor", Instructor)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: "*"
  },
  trans: {
    ffmpeg: "ffmpeg",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: false
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();