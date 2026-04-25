import {Router} from 'express'
const router = Router()
import {IsLoggedIn} from '../utils/auth.js'
import {register, login, me, logout} from '../Controller/Insauth.controller.js'
import {getAllInstructors, updateInstructorStatus, deleteInstructor, getCurrentInstructor,
    changeInstructorPassword, addCourse, getCourses, deleteCourse, editCourse,
    addClass, getAllClasses, deleteClass, editClass, getInstructorTotalCount,
    uploadClassPdf, getClassById, updateInstructorProfile
} from '../Controller/instructor.controller.js'
import {upload} from '../middlewares.js'
import {uploadPdf} from '../utils/uploadpdf.js'


router.post("/register", register);
router.post("/login", login)
// GET ALL INS
router.get("/instructors", getAllInstructors);
// Update instructor status
router.put("/instructors/:id/status", updateInstructorStatus);
// 
router.delete("/instructors/:id", deleteInstructor);
// get loggedin instructor
router.get("/instructor-details", IsLoggedIn, getCurrentInstructor);
// Change Instructor password
router.put("/change-password", IsLoggedIn, changeInstructorPassword);
router.get("/me", IsLoggedIn, me)
router.post("/ins-logout", logout)
// EDIT COURSE
// instructor.routes.js

// COURSES API
router.post("/addcourse",IsLoggedIn, upload.single("imageUrl"), addCourse);
router.get("/getcourses",IsLoggedIn, getCourses);
router.delete("/deletecourse/:id", deleteCourse);
router.put("/course/:id", upload.single("imageUrl"), editCourse);


// CLASS API
router.post("/addclass",IsLoggedIn, upload.single("thumbnail"), addClass);
router.get("/getclasses",IsLoggedIn, getAllClasses)
router.delete("/deleteclass/:id", deleteClass);
router.put("/edit-class/:id",upload.single("thumbnail"),editClass);

// 

router.get("/total-count",IsLoggedIn,getInstructorTotalCount);

// 
router.post("/upload-pdf/:id", uploadPdf.single("pdf"), uploadClassPdf);
// 
router.get("/class/:id", getClassById);
// 
router.put("/update-profile", IsLoggedIn, updateInstructorProfile);







export default router;