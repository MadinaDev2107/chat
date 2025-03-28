import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../utils/firebase.config";
import { ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!user.name || !user.email || !user.password) {
      return "All fields are required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      return "Invalid email format.";
    }
    if (user.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  }

  function register() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {
        const userId = res.user.uid;
        set(ref(database, `users/${userId}`), {
          name: user.name,
          email: user.email,
        }).then(() => {
          navigate("/login");
        });
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 px-3"
      style={{ backgroundColor: "#007bff" }}
    >
      <div
        className="card p-4 w-100 w-md-50 text-center"
        style={{ maxWidth: "400px" }}
      >
        <div className="border-bottom border-2 mb-3">
          <h2>Register</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex flex-column gap-3">
          <input
            placeholder="Name..."
            type="text"
            className="form-control form-control-lg"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
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
          <button onClick={register} className="btn btn-dark btn-lg">
            Save
          </button>
          <Link to={"/login"} className="text-primary">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
