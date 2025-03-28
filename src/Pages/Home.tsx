import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-white text-center px-3"
      style={{ backgroundColor: "#0088cc" }}
    >
      <h1 className="mb-4 fw-bold">Welcome!!!</h1>
      <button
        className="btn btn-light text-primary fw-bold px-4 py-2 w-100 w-md-auto"
        style={{ maxWidth: "300px" }}
        onClick={() => navigate("/register")}
      >
        Start Messaging
      </button>
    </div>
  );
};

export default Home;
