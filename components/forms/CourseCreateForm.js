import { Select, Button, Avatar, Badge, Card } from "antd";
const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 25; i <= 500; i += 25)
    children.push(<Option key={i.toFixed(2)}>{i.toFixed(2)} Lei</Option>);

  return (
    <Card
      className="container d-flex justify-content-center align-items-center p-4"
      style={{
        backgroundImage: `url("/create-form.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "700px",
      }}
    >
      {values && (
        <form onSubmit={handleSubmit} style={{ width: "400px" }}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group pt-2">
            <textarea
              name="description"
              placeholder="Description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group pt-2">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-row pt-2 d-flex align-items-center">
            <div className="col mr-2">
              <div className="form-group">
                <Select
                  style={{ width: "99%" }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="col ml-2">
                <div className="form-group">
                  <Select
                    defaultValue="25 Lei"
                    style={{ width: "100%" }}
                    onChange={(v) => setValues({ ...values, price: v })}
                    tokenSeparators={[,]}
                    size="large"
                  >
                    {children}
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="form-row pt-2 row d-flex justify-content-center ">
            <div className="col d-flex ">
              <div className="form-group">
                <label
                  className="btn btn-outline-secondary "
                  style={{ color: "white", backgroundColor: "grey" }}
                >
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  ></input>
                </label>
              </div>
            </div>
            <div className="col">
              {preview && (
                <Badge
                  count="X"
                  onClick={handleImageRemove}
                  className="pointer"
                >
                  <Avatar width={200} src={preview}></Avatar>
                </Badge>
              )}
              {editPage && values.image && (
                <Avatar width={200} src={values.image.Location}></Avatar>
              )}
            </div>
          </div>

          <div className="row pt-3">
            <div className="col  d-flex justify-content-center align-items-center">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn"
                loading={values.loading}
                size="large"
                shape="round"
                style={{ backgroundColor: "#7ca0d4", color: "white" }}
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
};

export default CourseCreateForm;
