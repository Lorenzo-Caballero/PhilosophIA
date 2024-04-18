import React, { useState } from "react";
import axios from "axios";

const ImageUploadModal = ({ isOpen, onClose }) => {
  const [values, setValues] = useState({
    name: "",
    price: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertImageToBase64(file);
    }
  };

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setValues((prevValues) => ({
        ...prevValues,
        image: reader.result,
      }));
    };
  };
  

  const handleUpload = async () => {
    try {
      if (!values.name || !values.price || !values.image) {
        console.error("Por favor complete todos los campos.");
        return;
      }


      const response = await axios.post(
        "https://nodejs-restapi-mysql-fauno-production.up.railway.app/api/amigurumis",
        JSON.stringify({ ...values, image: values.image }), // Enviar la URL acortada
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Diseño creado exitosamente");
        onClose();
      } else {
        console.error("Error al subir el diseño:", response.statusText);
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Subir imagen</h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={values.name}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="price"
            placeholder="Precio"
            value={values.price}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Subir
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;