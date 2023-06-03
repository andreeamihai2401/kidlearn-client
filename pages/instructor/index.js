import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
  };

  const myStyle = { marginTop: "-15px", fontSize: "10px" };

  return (
    <InstructorRoute>
      <div
        className=" d-flex justify-content-center  flex-column"
        style={{ paddingLeft: "210px" }}
      >
        <h1
          className=" text-center  mt-4"
          style={{ color: "#0A2D4D", fontWeight: "bold" }}
        >
          Instructor Dashboard
        </h1>

        {courses &&
          courses.map((course, index) => (
            <div className="media pt-3" key={course.slug}>
              <div className="row">
                <div className="col-auto">
                  <Avatar
                    size={100}
                    src={course.image ? course.image.Location : "/course.png"}
                  />
                </div>
                <div className="col">
                  <div className="media-body">
                    <div className="row">
                      <div className="col p-2">
                        <Link
                          legacyBehavior
                          href={`/instructor/course/view/${course.slug}`}
                          className="pointer"
                        >
                          <a className="mt-2 text-primary">
                            <h5 className="pt-2">{course.name}</h5>
                          </a>
                        </Link>
                        <p>{course.lessons.length} Lessons</p>

                        {course.lessons.length < 5 ? (
                          <p style={myStyle} className="text-warning">
                            At least 5 lessons are required to publish a course
                          </p>
                        ) : course.published ? (
                          <p style={myStyle} className="text-success">
                            Your course is live in the marketplace
                          </p>
                        ) : (
                          <p style={myStyle} className="text-success">
                            Your course is ready to be published
                          </p>
                        )}
                      </div>
                      <div className="col mt-2 text-center">
                        {course.published ? (
                          <Tooltip title="Published">
                            <CheckCircleOutlined
                              className="h5 pointer text-success"
                              style={{ marginTop: "10px" }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Unpublished">
                            <CloseCircleOutlined className="h5 pointer text-warning" />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index !== courses.length - 1 && <hr />}
            </div>
          ))}
      </div>
    </InstructorRoute>
  );
};

export default InstructorIndex;
