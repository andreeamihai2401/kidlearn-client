import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleFile,
  progress,
  handleFileRemove,
}) => {
  return (
    <div className="container">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        ></input>
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        ></textarea>

        <div className="container">
          <div className="mt-3">
            <div className="d-flex justify-content-center">
              <label className="btn btn-dark btn-block text-left form-control">
                {uploadButtonText}
                <input
                  onChange={handleFile}
                  type="file"
                  accept="image/*, video/* .pdf"
                  hidden
                />
              </label>
              {!uploading && values.file.Location && (
                <Tooltip title="Remove">
                  <span onClick={handleFileRemove} className="p-3">
                    <CloseCircleFilled className="text-danger d-flex justify-content-center  pointer" />
                  </span>
                </Tooltip>
              )}
            </div>

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
              onClick={handleAddLesson}
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
      </form>
    </div>
  );
};

export default AddLessonForm;
