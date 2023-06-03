import { Button, Progress, Tooltip } from "antd";
import {
  CloseCircleFilled,
  CheckCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const AddQuizForm = ({ quiz, setQuiz, handleAddQuiz, progress, uploading }) => {
  const handleAddQuestion = () => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = Array.isArray(prevQuiz) ? [...prevQuiz] : [];
      updatedQuiz.push({
        question: "",
        options: [],
        correctOptionIndex: -1,
      });
      return updatedQuiz;
    });
  };

  const handleQuestionChange = (questionIndex, question) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz[questionIndex] = { ...updatedQuiz[questionIndex], question };
      return updatedQuiz;
    });
  };

  const handleAddOption = (questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz[questionIndex].options.push("");
      return updatedQuiz;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz[questionIndex].options[optionIndex] = e.target.value;
      return updatedQuiz;
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz[questionIndex].options.splice(optionIndex, 1);
      return updatedQuiz;
    });
  };

  const handleRemoveQuestion = (questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz.splice(questionIndex, 1);
      return updatedQuiz;
    });
  };

  const handleSetCorrectOption = (questionIndex, optionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuiz = [...prevQuiz];
      updatedQuiz[questionIndex].correctOptionIndex = optionIndex;
      return updatedQuiz;
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleAddQuiz}>
        <div>
          {Array.isArray(quiz) &&
            quiz.map((question, questionIndex) => (
              <div key={questionIndex} className="mt-3">
                <span className="p-2">{`Question ${questionIndex + 1}`}</span>
                <div className="d-flex justify-content-between">
                  <input
                    type="text"
                    className="form-control square mb-3"
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, e.target.value)
                    }
                    value={question.question}
                    placeholder={`Question ${questionIndex + 1}`}
                    autoFocus={questionIndex === quiz.length - 1}
                    required
                  />
                  {quiz.length > 1 && (
                    <Tooltip title="Remove Question">
                      <span onClick={() => handleRemoveQuestion(questionIndex)}>
                        <CloseCircleFilled className="text-danger pointer p-1" />
                      </span>
                    </Tooltip>
                  )}
                </div>
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="d-flex justify-content-center p-1"
                  >
                    <input
                      type="text"
                      className="form-control square"
                      onChange={(e) =>
                        handleOptionChange(questionIndex, optionIndex, e)
                      }
                      value={question.options[optionIndex]}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    <Tooltip title="Remove">
                      <span
                        onClick={() =>
                          handleRemoveOption(questionIndex, optionIndex)
                        }
                        className="pt-1"
                      >
                        <CloseCircleFilled className="text-danger d-flex justify-content-center mt-1 pointer p-1" />
                      </span>
                    </Tooltip>
                    <Tooltip title="Set as Correct">
                      <span
                        onClick={() =>
                          handleSetCorrectOption(questionIndex, optionIndex)
                        }
                        className="pt-1 ml-1"
                      >
                        {question.correctOptionIndex === optionIndex ? (
                          <CheckCircleFilled className="text-success d-flex justify-content-center mt-1 pointer p-1" />
                        ) : (
                          <CheckCircleOutlined className="text-primary d-flex justify-content-center mt-1 pointer p-1" />
                        )}
                      </span>
                    </Tooltip>
                  </div>
                ))}

                <Button
                  onClick={() => handleAddOption(questionIndex)}
                  className="mt-3"
                  type="dashed"
                  size="small"
                >
                  Add Option
                </Button>
              </div>
            ))}

          <div className="container">
            <div className="mt-3">
              {progress > 0 && (
                <Progress
                  className="d-flex justify-content-center pt-2"
                  percent={progress}
                  steps={10}
                />
              )}
            </div>
            <div>
              <Button
                onClick={handleAddQuestion}
                className="mt-3 form-control"
                size="large"
                type="primary"
                shape="round"
              >
                Add Question
              </Button>
              <Button
                onClick={handleAddQuiz}
                className="mt-3 form-control"
                size="large"
                type="primary"
                loading={uploading}
                shape="round"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuizForm;
