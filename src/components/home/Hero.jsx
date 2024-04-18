import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import conejita1 from "../../assets/conejimarron.png";
import conejita2 from "../../assets/coneji-removebg-preview.png";
import conejita3 from "../../assets/osito-removebg-preview (2).png";
import portada from "../../assets/portada.jpg";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(conejita1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        switch (prevImage) {
          case conejita1:
            return conejita2;
          case conejita2:
            return conejita3;
          case conejita3:
            return conejita1;
          default:
            return conejita1;
        }
      });
    }, 8000); // Cambiar cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  const fadeInOut = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <motion.div
        className="absolute left-0 w-full h-full bg-cover bg-center "
        style={{ backgroundImage: `url(${portada})`, zIndex: -1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.img
        key={currentImage} // Key para forzar la remontaje de la imagen en cada cambio
        src={currentImage}
        alt="conejita"
        className="w-60 md:w-72 lg:w-80 mx-auto rounded-lg z-10"
        initial="hidden"
        animate="visible"
        variants={fadeInOut}
        transition={{
          duration: 2, // Duración de la transición
          ease: "easeInOut", // Tipo de transición
          scale: { duration: 1.5, yoyo: Infinity, ease: "easeInOut" }, // Efecto de zoom
        }}
      />
      <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
        {/* Aquí debes colocar tu dropdown del navbar */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-12 z-20">
        <Link to="/products">
          <motion.button
            className="px-4 py-2 font-serif font-bold rounded-full shadow-md m-2 bg-purple-600 bg-opacity-30 text-white"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
            transition={{ duration: 0.3 }}
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.4)" }}
          >
            Ver diseños
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
