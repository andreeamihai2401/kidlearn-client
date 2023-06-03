import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //state access
  const { state, dispatch } = useContext(Context);

  //router
  const router = useRouter();

  const { user } = state;

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });

      dispatch({
        type: "LOGIN",
        payload: data,
      });

      window.localStorage.setItem("user", JSON.stringify(data));
      router.push("/user");
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="row">
        <div className="col-md-6 p-5 mt-2">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "#d3e2f5", borderRadius: "20px" }}
          >
            <div className="col-md-12">
              <h1
                className="mt-5 text-center p-2"
                style={{ color: "#A2928E", fontWeight: "bold" }}
              >
                LOGIN
              </h1>

              <div className="pb-5 text-center">
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="form-control mb-4 p-4 mx-auto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{ width: "70%" }}
                  />

                  <input
                    type="password"
                    className="form-control mb-4 p-4 mx-auto"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ width: "70%" }}
                  />

                  <button
                    type="submit"
                    className="btn btn-block"
                    style={{
                      color: "white",
                      backgroundColor: "#A2928E",
                      width: "130px",
                      height: "50px",
                      borderRadius: "15px",
                    }}
                    disabled={!email || !password || loading}
                  >
                    {loading ? <SyncOutlined spin /> : "Submit"}
                  </button>

                  <p className="text-center pt-3" style={{ color: "#533b00" }}>
                    Not registered yet?{" "}
                    <Link legacyBehavior href="/register">
                      <a
                        style={{
                          textDecoration: "none",
                          color: "#7ca0d4",
                          fontWeight: "bold",
                        }}
                      >
                        Register
                      </a>
                    </Link>
                  </p>

                  <p className="text-center">
                    <Link legacyBehavior href="/forgot-password">
                      <a
                        className="text-danger"
                        style={{ textDecoration: "none" }}
                      >
                        Forgot password
                      </a>
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src="/background.png" width="400px" alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Login;
