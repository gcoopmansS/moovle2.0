import type { Sport } from "./types";

export interface SportFieldConfig {
  required: boolean;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean;
  // Form control properties
  type:
    | "text"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "time"
    | "textarea";
  options?: Array<{ value: string; label: string }>; // For select fields
  min?: number; // For number inputs
  max?: number; // For number inputs
  rows?: number; // For textarea
  // Layout properties
  width?: "full" | "half"; // Controls grid layout
  order?: number; // Controls field order
}

export interface SportConfiguration {
  name: string;
  displayName: string;
  // Sport selection metadata
  icon: string; // Icon component name
  color: {
    primary: string; // e.g., "blue", "green"
    hover: string; // e.g., "blue-500", "green-500"
    background: string; // e.g., "blue-50", "green-50"
    iconBg: string; // e.g., "blue-100", "green-100"
    iconColor: string; // e.g., "blue-600", "green-600"
  };
  fields: {
    title: SportFieldConfig;
    location: SportFieldConfig;
    duration: SportFieldConfig;
    maxParticipants: SportFieldConfig;
    // Sport-specific fields
    skillLevel?: SportFieldConfig;
    equipment?: SportFieldConfig;
  };
}

export const SPORT_CONFIGURATIONS: Record<Sport, SportConfiguration> = {
  tennis: {
    name: "tennis",
    displayName: "Tennis",
    icon: "TennisIcon",
    color: {
      primary: "blue",
      hover: "blue-500",
      background: "blue-50",
      iconBg: "blue-100",
      iconColor: "blue-600",
    },
    fields: {
      title: {
        required: true,
        label: "Activity Title",
        placeholder: "e.g., Morning Tennis Session",
        helpText: "Give your tennis session a descriptive name",
        type: "text",
        width: "full",
        order: 1,
      },
      location: {
        required: true,
        label: "Location",
        placeholder: "e.g., Central Park Tennis Courts",
        helpText: "Specify the tennis court or facility",
        type: "text",
        width: "full",
        order: 3,
      },
      duration: {
        required: true,
        label: "Duration (minutes)",
        placeholder: "90",
        helpText: "How long will the tennis session last?",
        defaultValue: 90,
        type: "number",
        min: 15,
        max: 480,
        width: "half",
        order: 4,
      },
      maxParticipants: {
        required: true,
        label: "Max Players",
        placeholder: "4",
        helpText: "Maximum players (2 for singles, 4 for doubles)",
        defaultValue: 4,
        type: "number",
        min: 2,
        max: 50,
        width: "half",
        order: 5,
      },
      skillLevel: {
        required: false,
        label: "Skill Level",
        placeholder: "e.g., Beginner, Intermediate, Advanced",
        helpText: "What skill level are you looking for?",
        type: "select",
        options: [
          { value: "", label: "Any skill level" },
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ],
        width: "full",
        order: 6,
      },
    },
  },
  padel: {
    name: "padel",
    displayName: "Padel",
    icon: "PadelIcon",
    color: {
      primary: "green",
      hover: "green-500",
      background: "green-50",
      iconBg: "green-100",
      iconColor: "green-600",
    },
    fields: {
      title: {
        required: true,
        label: "Activity Title",
        placeholder: "e.g., Evening Padel Match",
        helpText: "Give your padel session a descriptive name",
        type: "text",
        width: "full",
        order: 1,
      },
      location: {
        required: true,
        label: "Location",
        placeholder: "e.g., Padel Club Amsterdam",
        helpText: "Specify the padel court or facility",
        type: "text",
        width: "full",
        order: 3,
      },
      duration: {
        required: true,
        label: "Duration (minutes)",
        placeholder: "60",
        helpText: "How long will the padel session last?",
        defaultValue: 60,
        type: "number",
        min: 15,
        max: 480,
        width: "half",
        order: 4,
      },
      maxParticipants: {
        required: true,
        label: "Max Players",
        placeholder: "4",
        helpText: "Padel is always played with 4 players (2v2)",
        defaultValue: 4,
        type: "number",
        min: 4,
        max: 4,
        width: "half",
        order: 5,
      },
      skillLevel: {
        required: false,
        label: "Skill Level",
        placeholder: "e.g., Beginner, Intermediate, Advanced",
        helpText: "What skill level are you looking for?",
        type: "select",
        options: [
          { value: "", label: "Any skill level" },
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ],
        width: "full",
        order: 6,
      },
    },
  },
};

// Helper functions to work with sport configurations
export const getSportConfig = (sport: Sport): SportConfiguration => {
  return SPORT_CONFIGURATIONS[sport];
};

export const getRequiredFields = (sport: Sport): string[] => {
  const config = getSportConfig(sport);
  return Object.entries(config.fields)
    .filter(([, fieldConfig]) => fieldConfig.required)
    .map(([fieldName]) => fieldName);
};

export const getFieldConfig = (
  sport: Sport,
  fieldName: string
): SportFieldConfig | undefined => {
  const config = getSportConfig(sport);
  return config.fields[fieldName as keyof typeof config.fields];
};

export const getDefaultValues = (
  sport: Sport
): Record<string, string | number | boolean> => {
  const config = getSportConfig(sport);
  const defaults: Record<string, string | number | boolean> = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.defaultValue !== undefined) {
      defaults[fieldName] = fieldConfig.defaultValue;
    }
  });

  return defaults;
};

export const getOrderedFields = (
  sport: Sport
): Array<[string, SportFieldConfig]> => {
  const config = getSportConfig(sport);
  return Object.entries(config.fields).sort((a, b) => {
    const orderA = a[1].order || 999;
    const orderB = b[1].order || 999;
    return orderA - orderB;
  });
};

export const generateInitialFormData = (
  sportConfig: SportConfiguration | null
) => {
  const baseFields = {
    title: "",
    sport: "" as Sport | "",
    privacy: "MATES",
    date: "",
    time: "",
  };

  if (!sportConfig) return baseFields;

  // Add all config fields dynamically
  const dynamicFields = Object.keys(sportConfig.fields).reduce(
    (acc, fieldName) => {
      const fieldConfig =
        sportConfig.fields[fieldName as keyof typeof sportConfig.fields];
      if (fieldConfig) {
        acc[fieldName] = fieldConfig.defaultValue || "";
      }
      return acc;
    },
    {} as Record<string, string | number | boolean>
  );

  return { ...baseFields, ...dynamicFields };
};

export const getAllSports = (): Array<[Sport, SportConfiguration]> => {
  return Object.entries(SPORT_CONFIGURATIONS) as Array<
    [Sport, SportConfiguration]
  >;
};
