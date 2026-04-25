export function InstructorProfile() {
    return (
      <div className="bg-white border rounded-xl p-8 grid md:grid-cols-3 gap-8 items-center">
  
        {/* Left */}
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full border-4 border-slate-200 flex items-center justify-center text-5xl">
            🎓
          </div>
  
          <div>
            <h3 className="text-2xl font-bold">Super admin</h3>
            <p className="text-slate-600 mt-2 text-sm">
              As the Super Admin of our platform, I bring over a decade of experience
              in managing and leading digital transformation initiatives...
            </p>
  
            <div className="flex gap-3 mt-4">
              <button className="bg-purple-600 text-white p-3 rounded-full">f</button>
              <button className="bg-purple-600 text-white p-3 rounded-full">t</button>
              <button className="bg-purple-600 text-white p-3 rounded-full">▶</button>
            </div>
          </div>
        </div>
  
        {/* Right Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6 text-slate-700">
          <div className="flex items-center gap-3">
            ⭐ <span>5 Rating</span>
          </div>
          <div className="flex items-center gap-3">
            ⭐ <span>4 Reviews</span>
          </div>
          <div className="flex items-center gap-3">
            💬 <span>1792 Students</span>
          </div>
          <div className="flex items-center gap-3">
            📘 <span>6 Courses</span>
          </div>
        </div>
  
        <div className="col-span-full border-t border-purple-500 mt-6"></div>
      </div>
    );
  }
  