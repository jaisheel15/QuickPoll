import { BrowserRouter, Routes, Route } from "react-router-dom";
import PollList from "./pages/PollList";
import PollDetail from "./pages/PollDetail.tsx";
import CreatePoll from "./pages/CreatePoll.tsx";
import Signup from "./pages/Signup.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/polls/:id" element={<PollDetail />} />
        <Route path="/create" element={<CreatePoll />} />
      </Routes>
    </BrowserRouter>
  );
}