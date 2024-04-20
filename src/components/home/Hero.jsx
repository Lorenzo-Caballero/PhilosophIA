import React from 'react';
import './StarField.css'; // Asegúrate de tener el archivo CSS en tu proyecto

const StarField = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg"></div>
      <div className="star-field relative">
        <div className="layer"></div>
        
      </div>
      <div className="layer"></div>
      <div className="layer"></div>
    </div>
  );
}

export default StarField;