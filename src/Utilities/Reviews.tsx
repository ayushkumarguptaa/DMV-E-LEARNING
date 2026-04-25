export function CourseFullRating() {
    return (
      <div className="bg-white border rounded-xl p-8 space-y-6">
  
        <h2 className="text-3xl font-bold text-slate-800">
          Course Full Rating
        </h2>
  
        <div className="grid md:grid-cols-3 gap-8 items-center">
  
          {/* Left Rating */}
          <div className="text-center">
            <h3 className="text-6xl font-bold text-purple-600">0</h3>
            <div className="flex justify-center gap-1 my-2 text-yellow-400">
              {"★★★★★".split("").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="text-slate-500 text-lg">Course Rating</p>
          </div>
  
          {/* Rating Bars */}
          <div className="md:col-span-2 space-y-4">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4">
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div className="bg-purple-500 h-4 rounded-full w-0"></div>
                </div>
  
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: star }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {Array.from({ length: 5 - star }).map((_, i) => (
                    <span key={i} className="text-purple-200">★</span>
                  ))}
                </div>
  
                <span className="text-slate-500">(0)</span>
              </div>
            ))}
          </div>
        </div>
  
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-slate-600">No Review found</p>
          <p className="text-blue-600">
            <span className="cursor-pointer">Sign In</span> or{" "}
            <span className="cursor-pointer">Sign Up</span> as student to post a review
          </p>
        </div>
      </div>
    );
  }
  