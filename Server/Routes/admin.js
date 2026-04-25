import {Router} from 'express'
import {addInstructor,
  getInstructors, deleteInstructor,uploadLecture, getLecturesByCourse,
    getTotalClients, getDashboardEnrollments, getTotalEnrollmentAmount, 
    getAllCoursesForAdmin, approveCourse, rejectCourse, deleteClass, deleteCourse, getAllClassesForAdmin
} from '../Controller/admin.controller.js'
import {IsLoggedIn, upload} from '../middlewares.js'
import {uploadVideo} from '../videouploads.js'
import { generateQuizFromFile } from "../Controller/quizAi.controller.js"
import { quizUpload } from "../uploads/quiz/quizUpload.js";
import { saveAIGeneratedQuiz } from "../Controller/adminQuiz.controller.js";
import { getCoursesForQuiz } from "../Controller/adminQuiz.controller.js";
import {createPopup, getActivePopup, getAllPopups, deactivatePopup, deletePopup, activatePopup} from '../Controller/popup.controller.js'

const router = Router()




// INSTRUCTOR API
router.post("/addinstructor", upload.single("profile_image"), addInstructor);
router.get("/getinstructors", getInstructors);
router.delete("/deleteInstructor/:id", deleteInstructor);
// lectures
router.post("/upload-lecture", uploadVideo.single("video"),uploadLecture);
router.get("/getlectures/:course_id",getLecturesByCourse);
// DASHBOARD
router.get('/total-students', getTotalClients)
//quizAI
router.post("/generate-quiz",quizUpload.single("file"),generateQuizFromFile);
router.post("/save-ai-quiz", saveAIGeneratedQuiz);
router.get("/quiz/courses", getCoursesForQuiz);


router.get("/enrollments/details", getDashboardEnrollments);
// GET TOTAL ENROLLMENTS AMOUNT
router.get("/total-enrollment-amount", getTotalEnrollmentAmount);

// POP API

router.post("/popup", createPopup);
router.get("/popup", getActivePopup);
// 
router.get("/popup/all", getAllPopups);
// Activate popup
router.put("/popup/activate/:id", activatePopup);

// Deactivate popup
router.put("/popup/deactivate/:id", deactivatePopup);

// Delete popup
router.delete("/popup/:id", deletePopup);

// GET COURSES
// routes/courseRoutes.js
router.get("/courses", getAllCoursesForAdmin);
router.delete("/courses/:id", deleteCourse);

// 
// routes/courseRoutes.js
router.put("/course/approve/:id", approveCourse);
router.put("/course/reject/:id", rejectCourse);

// CLASS API
router.get("/classes", getAllClassesForAdmin);
router.delete("/deleteclass/:id", deleteClass);



export default router;