// Loader.tsx
import React from 'react';
import '../styles/Loader.scss'; // Optional: for styling

const Loader: React.FC = () => {
  return (
    <div className="loader">
      {/* You can customize this with any loading animation or spinner */}
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
