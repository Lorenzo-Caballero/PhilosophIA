import React from 'react';
import conejita from '../../assets/tales.png';
import { motion } from "framer-motion";

const Tales = () => {
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    zoom: {
      scale: [1, 1.05, 1],
      transition: { duration: 3, ease: "easeInOut", loop: Infinity }
    }
  };

  return (
    <div className="fixed top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="flex items-center justify-center"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="relative w-64 h-64 sm:w-96 sm:h-96 md:w-148 md:h-148"
          variants={imageVariants}
          animate="zoom"
          style={{
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))",
          }}
        >
          <motion.img
            src={conejita}
            alt="Tales"
            className="w-full h-full object-contain rounded-full cursor-pointer"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Tales;
