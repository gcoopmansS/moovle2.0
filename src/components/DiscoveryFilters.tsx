import { useState } from "react";

interface DiscoveryFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  sports: string[];
  location: string;
  distance: number;
  skillLevel: string;
}

const SPORTS_OPTIONS = ["tennis", "padel"];

const LOCATIONS = [
  "Amsterdam, Netherlands",
  "Utrecht, Netherlands",
  "Rotterdam, Netherlands",
  "The Hague, Netherlands",
  "Eindhoven, Netherlands",
];

export function DiscoveryFilters({
  onFiltersChange,
  isOpen,
  onClose,
}: DiscoveryFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    sports: [],
    location: "",
    distance: 25,
    skillLevel: "",
  });

  const handleSportToggle = (sport: string) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport];

    const newFilters = { ...filters, sports: newSports };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLocationChange = (location: string) => {
    const newFilters = { ...filters, location };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDistanceChange = (distance: number) => {
    const newFilters = { ...filters, distance };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillLevelChange = (skillLevel: string) => {
    const newFilters = { ...filters, skillLevel };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      sports: [],
      location: "",
      distance: 25,
      skillLevel: "",
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Discovery Filters
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        <div className="space-y-6">
          {/* Sports Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sports</h3>
            <div className="flex flex-wrap gap-2">
              {SPORTS_OPTIONS.map((sport) => (
                <button
                  key={sport}
                  onClick={() => handleSportToggle(sport)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.sports.includes(sport)
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Location
            </h3>
            <select
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white/70 backdrop-blur-sm"
            >
              <option value="">All locations</option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Distance: {filters.distance}km
            </h3>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={filters.distance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5km</span>
              <span>100km</span>
            </div>
          </div>

          {/* Skill Level Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Skill Level
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["Beginner", "Intermediate", "Advanced", "Professional"].map(
                (level) => (
                  <button
                    key={level}
                    onClick={() =>
                      handleSkillLevelChange(
                        filters.skillLevel === level ? "" : level
                      )
                    }
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      filters.skillLevel === level
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={clearFilters}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
