import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactMarkdown from "react-markdown";
import {
  PlayCircleOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";

const { Item } = Menu;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState({ lessons: [], quizzes: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/user/course/${slug}`);
      setCourse(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    console.log("COMPLETED LESSONS", data);
    setCompletedLessons(data);
  };

  const handleClick = (index) => {
    if (index !== clicked && lessonsAndQuizzes[index].contentType == "quiz") {
      resetQuizData();
      const selectedQuiz = lessonsAndQuizzes[index];
      const numQuestions = selectedQuiz.questions.length;
      setTotalQuestions(numQuestions);
      setShowResults(false);
    }
    setClicked(index);
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log("ALL", all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log("all without removed", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const lessonsAndQuizzes = [
    ...course.lessons,
    ...course.quizzes.filter((quiz) => quiz.contentType === "quiz"),
  ];

  lessonsAndQuizzes.sort((a, b) => {
    // Sort by createdAt for lessons
    if (a.contentType === "lesson" && b.contentType === "lesson") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    // Place quizzes at the end of the list
    if (a.contentType === "lesson") {
      return -1; // a is a lesson, b is a quiz
    } else if (b.contentType === "lesson") {
      return 1; // a is a quiz, b is a lesson
    }

    return 0; // both a and b are quizzes
  });

  const handleAnswerSelection = (questionIndex, optionIndex) => {
    const selectedQuestion =
      lessonsAndQuizzes[clicked].questions[questionIndex];
    const isCorrect = optionIndex === selectedQuestion.correctOptionIndex;

    const updatedResults = [...questionResults];
    updatedResults[questionIndex] = isCorrect ? "correct" : "incorrect";
    setQuestionResults(updatedResults);
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questionResults.forEach((result) => {
      if (result === "correct") {
        correctAnswers++;
      } else if (result === "incorrect") {
        incorrectAnswers++;
      }
    });

    setCorrectAnswers(correctAnswers);
    setIncorrectAnswers(incorrectAnswers);

    setShowResults(true);
  };

  const resetQuizData = () => {
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setQuestionResults([]);
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            className="text-primary mt-1 btn-block mb-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "..." : "Lessons"}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            className="custom-menu"
          >
            {lessonsAndQuizzes.map((item, index) => (
              <Item
                onClick={() => handleClick(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
                className="custom-menu-item ml-2"
              >
                <span className="menu-item-title p-2">
                  {item.contentType === "lesson" ? (
                    <span> {item.title.substring(0, 30)}</span>
                  ) : (
                    <span>QUIZ</span>
                  )}
                </span>
                {item.contentType == "lesson" ? (
                  completedLessons.includes(item._id) ? (
                    <CheckCircleFilled className="text-success menu-item-icon" />
                  ) : (
                    <MinusCircleFilled className="text-danger menu-item-icon" />
                  )
                ) : null}
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              {lessonsAndQuizzes[clicked].contentType === "lesson" ? (
                <div className="col alert alert-primary mt-2">
                  <b>{lessonsAndQuizzes[clicked].title.substring(0, 30)}</b>
                  {completedLessons.includes(lessonsAndQuizzes[clicked]._id) ? (
                    <div
                      className="pointer"
                      onClick={markIncompleted}
                      style={{ marginLeft: "auto" }}
                    >
                      Mark as incomplete
                    </div>
                  ) : (
                    <div
                      className="pointer"
                      onClick={markCompleted}
                      style={{ marginLeft: "auto" }}
                    >
                      Mark as completed
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="col alert alert-primary mt-2">
                    <b>Quiz</b>
                  </div>
                  <div className="">
                    <div className="">
                      {lessonsAndQuizzes[clicked].questions.map(
                        (question, questionIndex) => (
                          <div key={question._id} className="mt-2 ">
                            <h4 style={{ marginLeft: "50px" }}>
                              Question {questionIndex + 1}: {question.question}
                            </h4>
                            <ul
                              style={{
                                listStyleType: "none",
                                marginLeft: "80px",
                              }}
                            >
                              {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className="form-group">
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        value={optionIndex}
                                        onChange={() =>
                                          handleAnswerSelection(
                                            questionIndex,
                                            optionIndex
                                          )
                                        }
                                        className="form-check-input"
                                      />
                                      {option}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="col  d-flex justify-content-center align-items-center">
                    <Button
                      onClick={handleSubmitQuiz}
                      className="btn"
                      size="large"
                      shape="round"
                      style={{
                        backgroundColor: "#7ca0d4",
                        color: "white",
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                  {showResults && (
                    <div>
                      <p>Correct Answers: {correctAnswers}</p>
                      <p>Incorrect Answers: {incorrectAnswers}</p>
                      <p>
                        Final Score:{" "}
                        {((correctAnswers / totalQuestions) * 100).toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {lessonsAndQuizzes[clicked].file &&
              lessonsAndQuizzes[clicked].file.Location ? (
                <div className="wrapper  d-flex justify-content-center  flex-column">
                  {getFileExtension(
                    lessonsAndQuizzes[clicked].file.Location
                  ) === "mp4" ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      src={lessonsAndQuizzes[clicked].file.Location}
                      onEnded={() => markCompleted()}
                    ></video>
                  ) : getFileExtension(
                      lessonsAndQuizzes[clicked].file.Location
                    ) === "pdf" ? (
                    <iframe
                      src={lessonsAndQuizzes[clicked].file.Location}
                      width="100%"
                      height="600"
                    ></iframe>
                  ) : (
                    <img
                      src={lessonsAndQuizzes[clicked].file.Location}
                      alt="Lesson Image"
                      style={{
                        width: "50%",
                        height: "50%",
                        alignSelf: "center",
                      }}
                    />
                  )}
                </div>
              ) : null}

              <ReactMarkdown
                children={lessonsAndQuizzes[clicked].content}
              ></ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lessons to start learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
