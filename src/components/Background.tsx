import React from "react";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-raven-dark/10 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};