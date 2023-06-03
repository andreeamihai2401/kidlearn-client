import { List, Avatar } from "antd";

const SingleCourseQuizzes = ({ quizzes }) => {
  return (
    <div className="container p-3">
      <div className="row">
        <div className="col lesson-list">
          {quizzes && <h4>{quizzes.length} Quizzes</h4>}
          <hr />
          <List
            itemLayout="horizontal"
            dataSource={quizzes}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={<div>Quiz {index + 1}</div>}
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseQuizzes;
