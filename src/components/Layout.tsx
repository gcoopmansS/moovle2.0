import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { CreateActivityModal } from "./CreateActivityModal";

export default function Layout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Minimal Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Create Activity Modal - Renders at Layout level for full-page overlay */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
