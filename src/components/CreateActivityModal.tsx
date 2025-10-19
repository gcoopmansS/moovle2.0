import React, { useState } from "react";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateActivityModal({
  isOpen,
  onClose,
}: CreateActivityModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    privacy: "PUBLIC",
    date: "",
    time: "",
    location: "",
    duration: "",
    maxParticipants: "",
    autoAccept: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Creating activity:", formData);
    onClose();
    // Reset form
    setFormData({
      title: "",
      sport: "",
      privacy: "PUBLIC",
      date: "",
      time: "",
      location: "",
      duration: "",
      maxParticipants: "",
      autoAccept: false,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Activity
            </h2>
            <p className="text-gray-600 mt-1">
              Organize a sport activity with your mates
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Activity Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Morning Tennis Session"
                className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
            </div>

            {/* Sport & Privacy Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Sport
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select sport</option>
                  <option value="tennis">Tennis</option>
                  <option value="padel">Padel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Privacy
                </label>
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                >
                  <option value="PUBLIC">🌍 Public</option>
                  <option value="MATES">👥 Mates Only</option>
                  <option value="INVITE_ONLY">📩 Invite Only</option>
                </select>
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Central Park Tennis Courts"
                className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
            </div>

            {/* Duration & Capacity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="90"
                  min="15"
                  max="480"
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="2"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Auto Accept */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoAccept"
                name="autoAccept"
                checked={formData.autoAccept}
                onChange={handleInputChange}
                className="w-4 h-4 text-gray-900 bg-white border-gray-300 focus:ring-gray-900 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="autoAccept"
                className="text-sm text-gray-900 cursor-pointer"
              >
                Automatically accept join requests
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Create Activity
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="text-gray-600 text-lg">💡</div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Tips for great activities
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Choose a clear, descriptive title</li>
                  <li>• Pick a convenient location for participants</li>
                  <li>• Set realistic capacity based on sport type</li>
                  <li>• Enable auto-accept for casual activities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
