import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import SidebarLayout from "./components/SidebarLayout";
import Home from "./pages/Home";
import TasksList from "./pages/TasksList";
import TaskEditor from "./pages/TaskEditor";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route element={<PrivateRoute><SidebarLayout/></PrivateRoute>}>
        <Route path="/" element={<Home/>} />
        <Route path="/tasks/list" element={<TasksList/>} />
        <Route path="/tasks/new" element={<TaskEditor/>} />
      </Route>
    </Routes>
  );
}

export default App;