import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;

  const colors = ["#7CA0D4", "#FFD6E0", "#FFEF9F", "#C1FBA4", "#7BF1A8"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndex];

  return (
    <Link legacyBehavior href={`/course/${slug}`}>
      <a style={{ textDecoration: "none" }}>
        <Card
          className="mb-4 grow-on-hover"
          style={{
            backgroundColor: randomColor,
          }}
          cover={
            <img
              src={image ? image.Location : "/course.png"}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            ></img>
          }
        >
          <h2
            className="d-flex justify-content-center align-items-center"
            style={{ color: "#0A2D4D" }}
          >
            {name}
          </h2>
          <p
            className="d-flex justify-content-center align-items-center"
            style={{ color: "#0A2D4D" }}
          >
            by {instructor.name}
          </p>
          <div className="d-flex align-items-center">
            <Badge
              count={category}
              style={{ backgroundColor: "#7ca0d4" }}
              className="pt-2"
            />
            <h4
              className="pt-2 "
              style={{ marginLeft: "auto", color: "#FCB202" }}
            >
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: "lei",
                  })
                : "Free"}
            </h4>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
