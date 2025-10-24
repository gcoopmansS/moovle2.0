import React, { useState, useEffect } from "react";
import {
  getSportConfig,
  getOrderedFields,
  generateInitialFormData,
  getAllSports,
  type SportConfiguration,
  type SportFieldConfig,
} from "../domain/sportConfig";
import type { Sport } from "../domain/types";
import { TennisIcon, PadelIcon } from "./sportIcons";

// Icon mapping for dynamic rendering
const SPORT_ICONS = {
  TennisIcon: TennisIcon,
  PadelIcon: PadelIcon,
};
import { DynamicField } from "./DynamicField";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateActivityModal({
  isOpen,
  onClose,
}: CreateActivityModalProps) {
  const [step, setStep] = useState<"sport-selection" | "activity-form">(
    "sport-selection"
  );
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  const [formData, setFormData] = useState<
    Record<string, string | number | boolean>
  >({
    sport: "",
    privacy: "MATES",
    date: "",
    time: "",
  });

  const [currentSportConfig, setCurrentSportConfig] =
    useState<SportConfiguration | null>(null);

  // Handle sport selection
  const handleSportSelection = (sport: Sport) => {
    setSelectedSport(sport);
    const sportConfig = getSportConfig(sport);
    const initialData = generateInitialFormData(sportConfig);
    setFormData({
      ...initialData,
      sport,
      privacy: "MATES",
      date: "",
      time: "",
    });
    setStep("activity-form");
  };

  // Handle going back to sport selection
  const handleBackToSportSelection = () => {
    setStep("sport-selection");
    setSelectedSport(null);
    setFormData({
      sport: "",
      privacy: "MATES",
      date: "",
      time: "",
    });
    setCurrentSportConfig(null);
  };

  // Reset modal when closed
  const handleClose = () => {
    setStep("sport-selection");
    setSelectedSport(null);
    setFormData({
      sport: "",
      privacy: "MATES",
      date: "",
      time: "",
    });
    setCurrentSportConfig(null);
    onClose();
  };

  // Update form defaults when sport changes
  useEffect(() => {
    if (selectedSport) {
      const sportConfig = getSportConfig(selectedSport);
      setCurrentSportConfig(sportConfig);
    } else {
      setCurrentSportConfig(null);
    }
  }, [selectedSport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Creating activity:", formData);
    handleClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
              {step === "sport-selection"
                ? "Choose Your Sport"
                : `Create ${currentSportConfig?.displayName} Activity`}
            </h2>
            <p className="text-gray-600 mt-1">
              {step === "sport-selection"
                ? "Select which sport you want to organize"
                : `Organize a ${currentSportConfig?.displayName.toLowerCase()} activity with your mates`}
            </p>
          </div>
          <button
            onClick={handleClose}
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
          {step === "sport-selection" ? (
            // Step 1: Sport Selection
            <div className="space-y-6">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Choose Your Sport
                </h3>
                <p className="text-gray-600 text-lg">
                  Select a sport to create your activity
                </p>
              </div>

              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                  {getAllSports().map(([sportKey, sportConfig]) => {
                    const IconComponent =
                      SPORT_ICONS[sportConfig.icon as keyof typeof SPORT_ICONS];
                    const colors = sportConfig.color;

                    return (
                      <button
                        key={sportKey}
                        onClick={() => handleSportSelection(sportKey)}
                        className={`w-full group relative p-6 border-2 border-gray-200 hover:border-${colors.hover} hover:shadow-lg hover:shadow-${colors.background} transition-all duration-300 transform hover:-translate-y-1 bg-white cursor-pointer`}
                      >
                        {/* Icon Container */}
                        <div className="flex flex-col items-center space-y-3">
                          <div
                            className={`p-4 bg-${colors.iconBg} group-hover:bg-${colors.iconColor} group-hover:scale-110 transition-all duration-300`}
                          >
                            <IconComponent
                              className={`w-8 h-8 text-${colors.iconColor} group-hover:text-white transition-colors duration-300`}
                            />
                          </div>

                          {/* Sport Name */}
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                              {sportConfig.displayName}
                            </h3>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Activity Form
            <div>
              {/* Back button */}
              <button
                onClick={handleBackToSportSelection}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Back to sport selection</span>
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date & Time Row (always first) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date as string}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time as string}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Dynamic Sport Fields */}
                {currentSportConfig && selectedSport && (
                  <>
                    {(() => {
                      const orderedFields = getOrderedFields(selectedSport);
                      const elements: React.ReactElement[] = [];
                      let halfWidthGroup: Array<[string, SportFieldConfig]> =
                        [];

                      orderedFields.forEach(
                        ([fieldName, fieldConfig], index) => {
                          const value =
                            formData[fieldName] ??
                            (fieldConfig.defaultValue || "");

                          if (fieldConfig.width === "half") {
                            // Collect half-width fields
                            halfWidthGroup.push([fieldName, fieldConfig]);

                            // If we have 2 half-width fields or this is the last field, render the group
                            if (
                              halfWidthGroup.length === 2 ||
                              index === orderedFields.length - 1
                            ) {
                              elements.push(
                                <div
                                  key={`group-${halfWidthGroup[0][0]}`}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  {halfWidthGroup.map(([name, config]) => {
                                    const fieldValue =
                                      formData[name] ??
                                      (config.defaultValue || "");
                                    return (
                                      <div key={name}>
                                        <DynamicField
                                          fieldName={name}
                                          fieldConfig={config}
                                          value={fieldValue}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                              halfWidthGroup = []; // Reset the group
                            }
                          } else {
                            // Full width field - first flush any pending half-width group
                            if (halfWidthGroup.length > 0) {
                              elements.push(
                                <div
                                  key={`group-${halfWidthGroup[0][0]}`}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  {halfWidthGroup.map(([name, config]) => {
                                    const fieldValue =
                                      formData[name] ??
                                      (config.defaultValue || "");
                                    return (
                                      <div key={name}>
                                        <DynamicField
                                          fieldName={name}
                                          fieldConfig={config}
                                          value={fieldValue}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                              halfWidthGroup = [];
                            }

                            // Render full width field
                            elements.push(
                              <div key={fieldName}>
                                <DynamicField
                                  fieldName={fieldName}
                                  fieldConfig={fieldConfig}
                                  value={value}
                                  onChange={handleInputChange}
                                />
                              </div>
                            );
                          }
                        }
                      );

                      return elements;
                    })()}
                  </>
                )}

                {/* Privacy (always last) */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Privacy
                  </label>
                  <select
                    name="privacy"
                    value={formData.privacy as string}
                    onChange={handleInputChange}
                    className="custom-select w-full pl-4 pr-12 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="MATES">Mates Only</option>
                    <option value="PUBLIC">Public</option>
                    <option value="INVITE_ONLY">Invite Only</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
