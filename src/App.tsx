import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;
