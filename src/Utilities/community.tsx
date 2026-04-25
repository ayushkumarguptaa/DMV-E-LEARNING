import '../index.css'

function community(){
    return(
        <>
        <section className="bg-white p-5 mt-5 mb-5 community">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">

          {/* Item 1 */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Join our Community
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              Access industry-focused courses and hands-on projects to build
              in-demand skills.
            </p>
          </div>

          {/* Item 2 */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Gain Real Experience
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              Join internships, work on real projects, and enhance your career
              prospects.
            </p>
          </div>

          {/* Item 3 */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Get Hired
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              Build a strong profile, showcase your skills and connect with top
              companies.
            </p>
          </div>

        </div>
      </div>
    </section>
        </>
    )
}

export default community