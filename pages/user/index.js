import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div
        className=" d-flex justify-content-center  flex-column"
        style={{ paddingLeft: "200px" }}
      >
        {loading && (
          <SyncOutlined
            spin
            className="d-flex justify-content-center display-1 text-danger p-5"
          />
        )}
        <h1
          className=" text-center  mt-4"
          style={{ color: "#0A2D4D", fontWeight: "bold" }}
        >
          User Dashboard
        </h1>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={course._id} className="media pt-3">
              <div className="row align-items-center">
                <div className="col-auto">
                  <Avatar
                    size={100}
                    shape="circle"
                    src={course.image ? course.image.Location : "/course.png"}
                  />
                </div>
                <div className="col">
                  <div className="media-body">
                    <div className="row align-items-center">
                      <div className="col p-2">
                        <Link
                          legacyBehavior
                          href={`/user/course/${course.slug}`}
                          className="pointer"
                        >
                          <a className="d-flex align-items-center">
                            <h5 className="mt-2 text-primary">{course.name}</h5>
                            <PlayCircleOutlined
                              className="h2 ml-2 pointer text-primary"
                              style={{ marginLeft: "auto" }}
                            />
                          </a>
                        </Link>
                        <p>{course.lessons.length} lessons</p>
                        <p>By {course.instructor.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index !== courses.length - 1 && <hr />}
            </div>
          ))
        ) : (
          <h3 className="text-center" style={{ marginTop: "150px" }}>
            You have not enrolled in any course yet.
            <p className="text-center p-4 pointer">
              <Link legacyBehavior href="/">
                <b
                  className="text-success pointer"
                  style={{ textDecoration: "none" }}
                >
                  Start learning now!
                </b>
              </Link>
            </p>
          </h3>
        )}
      </div>
    </UserRoute>
  );
};

export default UserIndex;
