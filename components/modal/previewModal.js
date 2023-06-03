import { Modal } from "antd";

const PreviewModal = ({ showModal, setShowModal, preview }) => {
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };
  return (
    <>
      <Modal
        title="Course Preview"
        open={showModal}
        onCancel={() => setShowModal(!showModal)}
        width={720}
        footer={null}
      >
        <div className="wrapper d-flex justify-content-center  flex-column">
          <hr />
          {getFileExtension(preview) === "mp4" ? (
            <video
              width="100%"
              height="100%"
              controls={true}
              src={preview}
              playing={showModal}
            ></video>
          ) : (
            <img
              src={preview}
              alt="Lesson Image"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                display: "block",
                alignSelf: "center",
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
