import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import FeedPage from "./routes/FeedPage";
import AgendaPage from "./routes/AgendaPage";
import CreatePage from "./routes/CreatePage";
import NotificationsPage from "./routes/NotificationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
