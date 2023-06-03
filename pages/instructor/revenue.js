import { useState, useEffect } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = data;
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Unable to access payout settings. Try later.");
    }
  };

  return (
    <InstructorRoute>
      <div className="container mt-3 ">
        <div className="row pt-2 d-flex align-items-center justify-content-center">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ flexGrow: 1 }}>Revenue report</span>
              <DollarOutlined className="text-info" />
            </h2>
            <small>
              You get paid directly from stripe to your bank account every 48
              hours.
            </small>
            <hr />

            <h4 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ flexGrow: 1 }}>Pending balance</span>

              {balance.pending &&
                balance.pending.map((bp, i) => (
                  <span key={i} style={{ marginLeft: "auto" }}>
                    {stripeCurrencyFormatter(bp)}
                  </span>
                ))}
            </h4>
            <small>For last 48 hours</small>
            <hr />
            <h4 style={{ display: "flex", alignItems: "center" }}>
              <span style={{ flexGrow: 1 }}>Payouts</span>
              {!loading ? (
                <SettingOutlined
                  className="pointer text-info"
                  onClick={handlePayoutSettings}
                  style={{ marginLeft: "auto" }}
                />
              ) : (
                <SyncOutlined
                  spin
                  className="float-right pointer text-danger"
                />
              )}
            </h4>
            <small>
              Update your stripe account details or view previous payouts.
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
