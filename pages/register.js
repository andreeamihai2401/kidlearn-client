import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useContext(Context);

  const router = useRouter();

  const { user } = state;

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });

      toast.success("Registration succesful. Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
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
                REGISTER
              </h1>

              <div className="pb-5 text-center">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-4 p-4 mx-auto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                    style={{ width: "70%" }}
                  ></input>

                  <input
                    type="email"
                    className="form-control mb-4 p-4 mx-auto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{ width: "70%" }}
                  ></input>

                  <input
                    type="password"
                    className="form-control mb-4 p-4 mx-auto"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ width: "70%" }}
                  ></input>

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
                    disabled={!name || !email || !password || loading}
                  >
                    {loading ? <SyncOutlined spin /> : "Submit"}
                  </button>
                  <p className="text-center p-3" style={{ color: "#533b00" }}>
                    Already registered?{" "}
                    <Link legacyBehavior href="/login">
                      <a
                        style={{
                          textDecoration: "none",
                          color: "#7ca0d4",
                          fontWeight: "bold",
                        }}
                      >
                        Login
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

export default Register;
