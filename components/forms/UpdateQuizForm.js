import { Button, Tooltip } from "antd";
import {
  CloseCircleFilled,
  CheckCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useState } from "react";

const UpdateQuizForm = ({
  currentQuiz,
  setCurrentQuiz,
  handleUpdateQuiz,
  uploading,
}) => {
  const [questions, setQuestions] = useState(currentQuiz.questions);

  const handleQuestionChange = (questionIndex, question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      question,
    };
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        options: [],
        correctOptionIndex: -1,
      },
    ]);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleSetCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionIndex = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleUpdate = () => {
    setCurrentQuiz({ ...currentQuiz, questions });
  };

  return (
    <div className="container">
      <form onSubmit={handleUpdateQuiz}>
        <div>
          {questions.map((question, questionIndex) => (
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
                  autoFocus={questionIndex === questions.length - 1}
                  required
                />
                {questions.length > 1 && (
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
                onClick={handleUpdateQuiz}
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

export default UpdateQuizForm;
