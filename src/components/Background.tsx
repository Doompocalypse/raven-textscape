import React from "react";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/lovable-uploads/bf5aa511-adfd-48e2-8692-950ee6d3b996.png')" }}
      >
        <div className="absolute inset-0 bg-raven-dark/60 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};