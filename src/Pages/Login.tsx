import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../utils/firebase.config";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!user.email || !user.password) {
      return "All fields are required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      return "Invalid email format.";
    }
    return "";
  }

  function login() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (res) => {
        const userId = res.user.uid;
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          localStorage.setItem("token", res.user.uid);
          console.log("Login sahifasida token:", localStorage.getItem("token"));
          navigate("/chat");
        } else {
          setError("User not found in database.");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 px-3"
      style={{ backgroundColor: "#007bff" }}
    >
      <div className="card p-4 w-100 w-md-50 text-center" style={{ maxWidth: "400px" }}>
        <div className="border-bottom border-2 mb-3">
          <h2>Login</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex flex-column gap-3">
          <input
            placeholder="Email..."
            type="email"
            className="form-control form-control-lg"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <div className="input-group">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <button onClick={login} className="btn btn-dark btn-lg">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
