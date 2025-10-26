import React from "react";
import type { Activity } from "../domain/types";
import { mockUsers } from "../data/mockUsers";

interface ActivityEditFormProps {
  formData: Activity;
  pendingConfirm: string[];
  participants: typeof mockUsers;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ActivityEditForm: React.FC<ActivityEditFormProps> = ({
  formData,
  pendingConfirm,
  participants,
  onChange,
  onCancel,
  onSubmit,
}) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900">Edit Activity</h2>
      <button
        type="button"
        onClick={onCancel}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Title
      </label>
      <input
        name="title"
        value={formData.title}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Location
      </label>
      <input
        name="location"
        value={formData.location || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime.slice(0, 16)}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration (min)
        </label>
        <input
          type="number"
          name="durationMinutes"
          value={formData.durationMinutes || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          min={0}
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Capacity
      </label>
      <input
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        min={1}
        required
      />
    </div>
    {/* Participants List */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Participants
      </label>
      {participants.length > 0 ? (
        <div className="flex items-center mt-2 -space-x-2">
          {participants.slice(0, 5).map((user, idx) => {
            if (!user) return null;
            const isImageUrl =
              user.avatar?.startsWith("http") || user.avatar?.startsWith("/");
            const isOwner =
              idx === 0 && participants[0] && user.id === participants[0].id;
            return (
              <div
                key={user.id}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden text-xs font-medium bg-gray-200 relative ${
                  isOwner ? "border-gray-600" : "border-white"
                }`}
                title={user.name + (isOwner ? " (Owner)" : "")}
              >
                {isImageUrl ? (
                  <img
                    src={user.avatar || ""}
                    alt={user.name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.avatar}</span>
                )}
              </div>
            );
          })}
          {participants.length > 5 && (
            <div className="w-8 h-8 bg-gray-300 text-gray-600 text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
              +{participants.length - 5}
            </div>
          )}
        </div>
      ) : (
        <span className="ml-2 text-gray-400">No one joined yet</span>
      )}
      <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
        Editing this activity will notify all current participants and require
        them to re-confirm their attendance.
      </div>
    </div>
    <div className="flex justify-end gap-2 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 cursor-pointer"
      >
        Save Changes
      </button>
    </div>
  </form>
);
