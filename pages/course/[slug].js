import axios from "axios";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import SingleCourseDescription from "../../components/cards/SingleCourseDescription";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import SingleCourseQuizzes from "../../components/cards/SingleCourseQuizzes";
import { Context } from "../../context";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import PreviewModal from "../../components/modal/previewModal";

const SingleCourse = ({ course }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("CHECK ENROLLMENT", data);
    setEnrolled(data);
  };

  const handlePaidEnrollment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({
        sessionId: data,
      });
    } catch (err) {
      toast("Enrollment failed, try again.");
      console.log(err);
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast("Enrollment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseDescription
        course={course}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
        setPreview={setPreview}
        preview={preview}
        showModal={showModal}
        setShowModal={setShowModal}
      ></SingleCourseDescription>

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      ></PreviewModal>

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        ></SingleCourseLessons>
      )}

      {course.quizzes && (
        <SingleCourseQuizzes quizzes={course.quizzes}></SingleCourseQuizzes>
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
