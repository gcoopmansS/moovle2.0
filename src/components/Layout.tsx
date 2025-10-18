import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Minimal Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
