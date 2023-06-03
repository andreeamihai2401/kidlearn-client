import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { useState, useEffect } from "react";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
import UpdateQuizForm from "../../../../components/forms/UpdateQuizForm";
const CourseEdit = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    lessons: [],
    quizzes: [],
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  //state for lesson update
  const [visible, setVisible] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState({});
  const [uploadFileButtonText, setUploadFileButtonText] =
    useState("Upload file");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  //router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //resize
    Resizer.default.imageFileResizer(
      file,
      720,
      500,
      "JPEG",
      100,
      0,
      async (uri) => {
        try {
          let { data } = await axios.post("/api/course/upload-image", {
            image: uri,
          });
          console.log("IMAGE UPLOADEd", data);
          //set image in the state
          setImage(data);
          setValues({ ...values, loading: false });
        } catch (err) {
          console.log(err);
          setValues({ ...values, loading: false });
          toast("Image upload failed. Try later.");
        }
      }
    );
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast("Image remove failed. Try later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course updated!");
      // router.push("/instructor");
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;

    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; //dragged item to re-order

    allLessons.splice(movingItemIndex, 1); //remove one item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: [...allLessons] });

    //save the new lessons order in db

    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });

    console.log("LESSONS REORDERED RESPONSE ", data);
    toast("Lessons were rearanged successfully");
  };

  const handleDeleteLesson = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });
    //send req to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    console.log("lesson deleted", data);
  };

  const handleDeleteQuiz = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;
    let allQuizzes = values.quizzes;
    const removed = allQuizzes.splice(index, 1);
    setValues({ ...values, quizzes: allQuizzes });
    //send req to server
    const { data } = await axios.put(
      `/api/course/${slug}/quiz/${removed[0]._id}`
    );
    setCurrentQuiz({});
    toast("Quiz deleted!");
  };

  //lesson update functions

  const handleFile = async (e) => {
    //remove previos file
    if (current.file && current.file.Location) {
      const res = await axios.post(
        `/api/course/file-remove/${values.instructor._id}`,
        current.file
      );
      console.log("REMOVED", res);
    }
    //upload new file
    const file = e.target.files[0];
    setUploadFileButtonText(file.name);
    setUploading(true);

    //send file as form data
    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("courseId", values._id);

    //save progress bar and send file as form data to server
    const { data } = await axios.post(
      `/api/course/file-upload/${values.instructor._id}`,
      fileData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round(100 * e.loaded) / e.total),
      }
    );
    console.log(data);
    setCurrent({ ...current, file: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadFileButtonText("Upload file");
    setVisible(false);

    //update ui
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      setUploading(false);
      toast("Lesson updated");
    }
  };

  const handleUpdateQuiz = async () => {
    const { data } = await axios.put(
      `/api/course/quiz/${slug}/${currentQuiz._id}`,
      currentQuiz
    );

    setQuizVisible(false);

    //update ui
    if (data.ok) {
      let arr = values.quizzes;
      const index = arr.findIndex((el) => el._id === currentQuiz._id);
      arr[index] = currentQuiz;
      setValues({ ...values, quizzes: arr });
      setUploading(false);
      toast("Quiz updated");
    }
  };

  return (
    <InstructorRoute>
      <div>
        <h1 className="jumbotron text-center mt-4">Edit Course</h1>

        <div className="pt-3 pb-3">
          <CourseCreateForm
            handleSubmit={handleSubmit}
            handleImage={handleImage}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            preview={preview}
            uploadButtonText={uploadButtonText}
            handleImageRemove={handleImageRemove}
            editPage={true}
          />
        </div>
        <hr style={{ marginLeft: "200px" }} />

        <div className="row pb-5 " style={{ marginLeft: "200px" }}>
          <div className="col lesson-list">
            <h4 className="mt-3">
              {values && values.lessons && values.lessons.length} Lessons
            </h4>

            <List
              onDragOver={(e) => e.preventDefault()}
              itemLayout="horizontal"
              dataSource={values && values.lessons}
              renderItem={(item, index) => (
                <List.Item
                  draggable
                  onDragStart={(e) => handleDrag(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <List.Item.Meta
                    onClick={() => {
                      setVisible(true);
                      setCurrent(item);
                    }}
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={item.title}
                  />

                  <DeleteOutlined
                    onClick={() => handleDeleteLesson(index)}
                    className="text-danger float-right"
                  ></DeleteOutlined>
                </List.Item>
              )}
            />
          </div>
        </div>

        <div className="row pb-5 " style={{ marginLeft: "200px" }}>
          <div className="col lesson-list">
            <h4 className="mt-3">
              {values && values.quizzes && values.quizzes.length} Quizzes
            </h4>

            <List
              onDragOver={(e) => e.preventDefault()}
              itemLayout="horizontal"
              dataSource={values && values.quizzes}
              renderItem={(item, index) => (
                <List.Item
                  draggable
                  onDragStart={(e) => handleDrag(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <List.Item.Meta
                    onClick={() => {
                      setQuizVisible(true);
                      setCurrentQuiz(item);
                    }}
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={<div>Quiz {index + 1}</div>}
                  />

                  <DeleteOutlined
                    onClick={() => handleDeleteQuiz(index)}
                    className="text-danger float-right"
                  ></DeleteOutlined>
                </List.Item>
              )}
            />
          </div>
        </div>
        <Modal
          title="Update lesson"
          centered
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <UpdateLessonForm
            current={current}
            setCurrent={setCurrent}
            handleFile={handleFile}
            handleUpdateLesson={handleUpdateLesson}
            uploadFileButtonText={uploadFileButtonText}
            progress={progress}
            uploading={uploading}
          />
        </Modal>

        <Modal
          title="Update Quiz"
          centered
          open={quizVisible}
          onCancel={() => setQuizVisible(false)}
          footer={null}
        >
          <UpdateQuizForm
            currentQuiz={currentQuiz}
            setCurrentQuiz={setCurrentQuiz}
            handleUpdateQuiz={handleUpdateQuiz}
            uploading={uploading}
          />
        </Modal>
      </div>
    </InstructorRoute>
  );
};

export default CourseEdit;
