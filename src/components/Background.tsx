import React from "react";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-apocalyptic bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-raven-dark/80 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};