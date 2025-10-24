import { IoTennisballOutline } from "react-icons/io5";

interface IconProps {
  className?: string;
}

// Tennis Ball Icon - using React Icons
export function TennisIcon({ className = "w-6 h-6" }: IconProps) {
  return <IoTennisballOutline className={className} />;
}

// Padel Racket Icon
export function PadelIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Racket head - more rounded/circular */}
      <rect
        x="7"
        y="3"
        width="10"
        height="12"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Handle - shorter */}
      <rect
        x="11"
        y="15"
        width="2"
        height="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Strings - horizontal */}
      <line
        x1="8"
        y1="6"
        x2="16"
        y2="6"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="8"
        y1="9"
        x2="16"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Strings - vertical */}
      <line
        x1="10"
        y1="4"
        x2="10"
        y2="14"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="14"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="14"
        y1="4"
        x2="14"
        y2="14"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Holes in padel racket - better positioned */}
      <circle cx="9" cy="7" r="0.5" fill="currentColor" />
      <circle cx="12" cy="7" r="0.5" fill="currentColor" />
      <circle cx="15" cy="7" r="0.5" fill="currentColor" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" />
      <circle cx="12" cy="10" r="0.5" fill="currentColor" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" />
      <circle cx="9" cy="13" r="0.5" fill="currentColor" />
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
      <circle cx="15" cy="13" r="0.5" fill="currentColor" />
    </svg>
  );
}
