import { Button, Progress, Switch } from "antd";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadFileButtonText,
  handleFile,
  progress,
}) => {
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  return (
    <div className="container">
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          autoFocus
          required
        ></input>

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>

        <div className="container">
          <div className="mt-3">
            <div>
              {!uploading && current.file && current.file.Location && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getFileExtension(current.file.Location) === "mp4" ? (
                      <video
                        width="100%"
                        height="100%"
                        controls
                        src={current.file.Location}
                        onEnded={() => markCompleted()}
                      ></video>
                    ) : getFileExtension(current.file.Location) === "pdf" ? (
                      <></>
                    ) : (
                      <img
                        src={current.file.Location}
                        alt="Lesson Image"
                        style={{
                          maxWidth: "50%",
                          maxHeight: "50%",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
              <label className="btn btn-dark btn-block text-left form-control mt-2">
                {uploadFileButtonText}
                <input
                  onChange={handleFile}
                  type="file"
                  accept="image/*, video/*"
                  hidden
                />
              </label>
            </div>

            {progress > 0 && (
              <Progress
                className="d-flex justify-content-center pt-2"
                percent={progress}
                steps={10}
              />
            )}

            <div className="d-flex justify-content-between pt-2">
              <span className="pt-3 ">Preview</span>
              <Switch
                className="float-right mt-2"
                disabled={uploading}
                checked={current.free_preview}
                name="free-preview"
                onChange={(v) => setCurrent({ ...current, free_preview: v })}
              />
            </div>
          </div>

          <div>
            <Button
              onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
