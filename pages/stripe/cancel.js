import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      <div className="row text-center align-items-center justify-content-center">
        <div className="col-md-9">
          <CloudSyncOutlined className="display-1 text-danger p-5" />
          <p className="lead">Payment failed. Try again.</p>
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
