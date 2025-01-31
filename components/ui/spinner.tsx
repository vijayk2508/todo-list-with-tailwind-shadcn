import React from "react";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "medium" }) => {
  const sizeClass = {
    small: "h-4 w-4",
    large: "h-8 w-8",
    medium: "h-6 w-6",
  }[size];

  return (
    <output
      className={`spinner-border animate-spin inline-block border-4 rounded-full ${sizeClass}`}
    >
      <span className="visually-hidden"></span>
    </output>
  );
};
