import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({ courses }) => {
  return (
    <>
      <h1
        className="d-flex justify-content-center align-items-center p-2"
        style={{ color: "#0A2D4D", fontWeight: "bold" }}
      >
        KidLearn
      </h1>
      <h5
        className="d-flex justify-content-center align-items-center p-2"
        style={{
          backgroundColor: "#A2928E",
          color: "white",
          fontFamily: "'Londrina Sketch', cursive",
        }}
      >
        Where curiosity meets education, magic happens!
      </h5>
      <div className="container-fluid pt-2">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course}></CourseCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
