import {Router} from 'express'
import {signup, login, logout} from '../Controller/auth.controller.js'
import {sendContactMessage, checkLogin, getClasses, getCourses, enrollCourse,
    getEnrolledCourses, getLecturesByCourseId, verifyPayment, getCourseById,
    top_courses, getAllEnrolledCourses, getEnrolledUsersCount, getTopEnrolledCourses,
    Ratings, getLectureRating, getTotalRatingsCount, checkCourseEnrollment, getAttemptedQuizzes
} from '../Controller/user.controller.js'
import {IsLoggedIn} from '../middlewares.js'
import { getUserQuizzes } from "../Controller/userQuiz.controller.js";
import { submitQuiz } from "../Controller/userQuiz.controller.js";
import { startQuiz } from "../Controller/userQuiz.controller.js";



const router = Router()


router.post('/signup',signup);
router.post('/login',login);
router.post("/logout", logout);
router.get("/check-Login",IsLoggedIn, checkLogin);
// Send Contact Message
router.post("/contact", sendContactMessage);
// GET CLASSES
router.get('/getclasses',getClasses)
// get courses
router.get("/get-courses", getCourses)
// TOP 3 ENROLLED COURSES
router.get("/courses/top-enrolled", getTopEnrolledCourses);
// TOP COURSES
router.get("/courses/top", top_courses)
// GET BY COURSE ID
router.get("/courses/:courseId", getCourseById);

// ENROLL IN COURSE - RZP
router.post("/enroll",IsLoggedIn, enrollCourse);
router.post("/enroll/verify-payment",IsLoggedIn,verifyPayment);
// GET ENROLLED COURSES
router.get("/enrolled-courses", IsLoggedIn, getEnrolledCourses);
// GET LECTURE BY COURSE ID
router.get("/lectures/:courseId",IsLoggedIn, getLecturesByCourseId);
// GET ALL ENROLL COURSES
router.get("/all-enrolled-courses", getAllEnrolledCourses);
// GET ENROLLED USER COUNT
router.get("/enrolled-users/count", getEnrolledUsersCount);
// RATING
router.post("/lecture/rate",IsLoggedIn, Ratings )
router.get("/lecture/rating/:lecture_id",IsLoggedIn,getLectureRating);
// Rating count
router.get("/ratings/count", getTotalRatingsCount)
// CHECK COURSE ENROLLMENTS
router.get("/is-enrolled/:course_id",IsLoggedIn,checkCourseEnrollment);

// QUIZ API
router.get("/quizzes", IsLoggedIn, getUserQuizzes);
router.post("/quiz/submit", IsLoggedIn, submitQuiz);
router.get("/quiz/:quizId/start", IsLoggedIn, startQuiz);

// 

router.get("/quizzes/attempted", IsLoggedIn, getAttemptedQuizzes);



export default router