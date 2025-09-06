import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/auth";
import CommonLayout from "./components/common-layout";
import TasksPage from "./pages/tasks";
import ScrumBoardPage from "./pages/scrum-board";

function App() {
  return (
    <Routes>
      {/* Default route → redirect to auth */}
      <Route path="/" element={<Navigate to="/auth" />} />

      {/* Auth route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes under /tasks */}
      <Route path="/tasks" element={<CommonLayout />}>
        <Route path="list" element={<TasksPage />} />
        <Route path="scrum-board" element={<ScrumBoardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
