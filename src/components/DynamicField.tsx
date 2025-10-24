import React from "react";
import type { SportFieldConfig } from "../domain/sportConfig";
import { LocationAutocomplete } from "./LocationAutocomplete";

interface DynamicFieldProps {
  fieldName: string;
  fieldConfig: SportFieldConfig;
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  className?: string;
}

export function DynamicField({
  fieldName,
  fieldConfig,
  value,
  onChange,
  className = "",
}: DynamicFieldProps) {
  const baseClassName = `w-full px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors ${className}`;

  const renderField = () => {
    switch (fieldConfig.type) {
      case "text":
        return (
          <input
            type="text"
            name={fieldName}
            value={value as string}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
            className={baseClassName}
            required={fieldConfig.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            name={fieldName}
            value={value as number}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
            min={fieldConfig.min}
            max={fieldConfig.max}
            className={baseClassName}
            required={fieldConfig.required}
          />
        );

      case "select":
        return (
          <select
            name={fieldName}
            value={value as string}
            onChange={onChange}
            className={`custom-select w-full pl-4 pr-12 py-3 border border-gray-200 bg-white focus:outline-none focus:border-gray-900 transition-colors cursor-pointer appearance-none ${className}`}
            required={fieldConfig.required}
          >
            {fieldConfig.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            name={fieldName}
            checked={value as boolean}
            onChange={onChange}
            className="w-4 h-4 text-gray-900 bg-white border-gray-300 focus:ring-gray-900 focus:ring-2 cursor-pointer"
          />
        );

      case "date":
        return (
          <input
            type="date"
            name={fieldName}
            value={value as string}
            onChange={onChange}
            className={`${baseClassName} cursor-pointer`}
            required={fieldConfig.required}
          />
        );

      case "time":
        return (
          <input
            type="time"
            name={fieldName}
            value={value as string}
            onChange={onChange}
            className={`${baseClassName} cursor-pointer`}
            required={fieldConfig.required}
          />
        );

      case "location":
        return (
          <LocationAutocomplete
            name={fieldName}
            value={value as string}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
            className={className}
            onLocationSelect={(location) => {
              // Store additional location data if needed
              console.log("Selected location:", location);
            }}
          />
        );

      case "textarea":
        return (
          <textarea
            name={fieldName}
            value={value as string}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
            rows={fieldConfig.rows || 3}
            className={baseClassName}
            required={fieldConfig.required}
          />
        );

      default:
        return (
          <input
            type="text"
            name={fieldName}
            value={value as string}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
            className={baseClassName}
            required={fieldConfig.required}
          />
        );
    }
  };

  return (
    <div className={fieldConfig.width === "half" ? "" : ""}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {fieldConfig.label}
        {fieldConfig.required && " *"}
      </label>
      {renderField()}
      {fieldConfig.helpText && (
        <p className="text-xs text-gray-500 mt-1">{fieldConfig.helpText}</p>
      )}
    </div>
  );
}
