import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import AllLessons from "./pages/AllLessons";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Test from "./pages/Test";
import TestReview from "./pages/TestReview";
import SubjectPage from "./pages/Subject";
import TopicPage from "./pages/Topic";
import StatisticsPage from "./pages/StatisticsPage";
import SavedQuizsPage from "./pages/SavedQuizsPage";
import Leaderboard from "./pages/Leaderboard";
import PremiumPage from "./pages/PremiumPage";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/all-lessons" element={<AllLessons />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test-review" element={<TestReview />} />
        <Route path="/subject" element={<SubjectPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/statistic" element={<StatisticsPage />} />
        <Route path="/save-quiz" element={<SavedQuizsPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
  );
}
