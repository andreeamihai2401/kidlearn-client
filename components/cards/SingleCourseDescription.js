import { Badge, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

const SingleCourseDescription = ({
  course,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
  setEnrolled,
  setPreview,
  preview,
  setShowModal,
  showModal,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <>
      <div
        className="p-2 m-2"
        style={{ backgroundColor: "#9194D1", borderRadius: "20px" }}
      >
        <div className="row">
          <div className="col-md-8">
            {/* {title} */}
            <h1
              className="text-light font-weight-bold"
              style={{ padding: "30px" }}
            >
              {name}
            </h1>
            {/* {description} */}
            <p
              className="lead"
              style={{ color: "#0A2D4D", marginLeft: "30px" }}
            >
              {description && description.substring(0, 160)}...
            </p>
            {/* {category} */}
            <Badge
              count={category}
              style={{ backgroundColor: "#7ca0d4", marginLeft: "30px" }}
              className="pb-4 mr-2"
            ></Badge>
            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "30px" }}
            >
              {/* {instructor} */}
              <p>Created by {instructor.name}</p>
              {/* {updatedAt} */}
              <p style={{ marginLeft: "70px" }}>
                Last updated {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
            {/* {price} */}
            <h4 className="text-light" style={{ marginLeft: "30px" }}>
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: "lei",
                  })
                : "Free"}
            </h4>
          </div>
          <div className="col-md-4" style={{ padding: "30px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={image ? image.Location : "/course.png"}
                alt={name}
                className="img img-fluid"
                onClick={() => {
                  setPreview(image.Location);
                  setShowModal(!showModal);
                }}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  display: "block",
                }}
              ></img>
            </div>

            {/* enroll button */}
            {loading ? (
              <div className="d-flex justify-content-center">
                <LoadingOutlined className="h1 text-danger"></LoadingOutlined>
              </div>
            ) : (
              <Button
                className="mb-3 mt-4"
                block
                shape="round"
                icon={<SafetyOutlined />}
                size="large"
                disabled={loading}
                color="white"
                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
              >
                {user
                  ? enrolled.status
                    ? "Go to course"
                    : "Enroll"
                  : "Login to enroll"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCourseDescription;
