import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import AddQuizForm from "../../../../components/forms/AddQuizForm";
import { toast } from "react-toastify";

const CourseView = () => {
  const [course, setCourse] = useState({});
  //for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    file: {},
  });

  const [quiz, setQuiz] = useState([
    {
      question: "",
      options: [],
      correctOptionIndex: -1,
    },
  ]);

  //for quiz
  const [quizVisible, setQuizVisible] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload file");
  const [progress, setProgress] = useState(0);
  //student count
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post("/api/instructor/student-count", {
      courseId: course._id,
    });
    console.log("student count", data);
    setStudents(data.length);
  };

  //FUNCTIONS FOR ADD LESSON
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: "", content: "", file: {} });
      setProgress(0);
      setUploadButtonText("Upload file");
      setVisible(false);
      setCourse(data);
      toast("Lesson added");
    } catch (err) {
      console.log(err);
      toast("Lesson add failed");
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/quiz/${slug}/${course.instructor._id}`,
        quiz
      );
      setQuiz({ ...quiz, question: "", options: [], correctOptionIndex: -1 });
      setQuizVisible(false);
      setCourse(data);
      toast("Quiz added");
    } catch (err) {
      console.log(err);
      toast("Quiz add failed");
    }
  };

  const handleFile = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const fileData = new FormData();
      fileData.append("file", file);
      //save progress bar and send file as form data to backend
      const { data } = await axios.post(
        `/api/course/file-upload/${course.instructor._id}`,
        fileData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      // once res is received
      console.log(data);
      setValues({ ...values, file: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast("File upload failed.");
    }
  };

  const handleFileRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/file-remove/${course.instructor._id}`,
        values.file
      );
      console.log(data);
      setValues({ ...values, file: {} });
      setProgress(0);
      setUploading(false);
      setUploadButtonText("Upload another file");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast("File remove failed.");
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you publish the course, it will be live in the marketplace for users to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast("Congrats! Your course is now live.");
    } catch (err) {
      toast("Course publish failed. Try again!");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you unpublish the course, it will be unavailable to users."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast("Your course is unavailable.");
    } catch (err) {
      toast("Course unpublish failed. Try again!");
    }
  };

  return (
    <InstructorRoute>
      <div
        className=" d-flex justify-content-center  flex-column"
        style={{ paddingLeft: "210px" }}
      >
        {course && (
          <div className="container-fluid pt-1">
            <div className="row align-items-center">
              <div className="col-auto">
                <Avatar
                  size={80}
                  src={course.image ? course.image.Location : "/course.png"}
                />
              </div>

              <div className="col pt-2">
                <div>
                  <h5 className="mt-2 text-primary">{course.name}</h5>
                  <div className="d-flex align-items-baseline">
                    <p className="mb-0">
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                  </div>
                  <p style={{ fontSize: "10px" }}>{course.category}</p>
                </div>
              </div>

              <div className="col-auto">
                <div className="d-flex">
                  <Tooltip title={`${students} enrolled`}>
                    <UserSwitchOutlined className="h5 pointer text-info mr-4 p-2" />
                  </Tooltip>
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() =>
                        router.push(`/instructor/course/edit/${slug}`)
                      }
                      className="h5 pointer text-warning mr-4 p-2"
                    />
                  </Tooltip>

                  {course.lessons && course.lessons.length < 5 ? (
                    <Tooltip title="Min 5 lessons required to publish">
                      <QuestionOutlined className="h5 pointer text-danger p-2"></QuestionOutlined>
                    </Tooltip>
                  ) : course.published ? (
                    <Tooltip
                      title="Unpublish"
                      className="h5 pointer text-danger p-2"
                    >
                      <CloseOutlined
                        onClick={(e) => handleUnpublish(e, course._id)}
                      ></CloseOutlined>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Publish"
                      className="h5 pointer text-success p-2"
                    >
                      <CheckOutlined
                        onClick={(e) => handlePublish(e, course._id)}
                      ></CheckOutlined>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown children={course.description} />
              </div>
            </div>
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
              <Button
                onClick={() => setQuizVisible(true)}
                className="col-md-6 offset-md-3 text-center mt-3"
                shape="round"
                icon={<QuestionOutlined />}
                size="large"
              >
                Add Quiz
              </Button>
            </div>

            <Modal
              title="+ Add Lesson"
              centered
              open={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <hr />
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleFile={handleFile}
                progress={progress}
                handleFileRemove={handleFileRemove}
              />
            </Modal>

            <Modal
              title="+ Add Quiz"
              centered
              open={quizVisible}
              onCancel={() => setQuizVisible(false)}
              footer={null}
            >
              <hr />
              <AddQuizForm
                quiz={quiz}
                setQuiz={setQuiz}
                handleAddQuiz={handleAddQuiz}
                uploading={uploading}
              />
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4 className="mt-5">
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>

                {course && course.lessons && course.lessons.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={course.lessons}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No lessons added yet</p>
                )}

                <h4 className="mt-5">
                  {course && course.quizzes && course.quizzes.length} Quizzes
                </h4>

                {course && course.quizzes && course.quizzes.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={course.quizzes}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={<div>Quiz {index + 1}</div>}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No quizzes added yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
