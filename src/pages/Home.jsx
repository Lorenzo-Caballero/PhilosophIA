import React from 'react';

import { motion } from 'framer-motion';
import Hero from "../components/home/Hero";
import ChatBot from '../components/home/ChatBot';

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: { duration: .3 }
  },
  exit: {
    x: '-100vw',
    transition: { ease: 'easeInOut' }
  }
}


const Home = () => {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="chat-container">
          <ChatBot />
        </div>
      <Hero />
    </motion.main>
  );
};

export default Home;
