import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { motion } from "framer-motion";
import { CohereClient } from "cohere-ai";
import axios from 'axios';
import { HfInference } from '@huggingface/inference';

const ChatButton = () => {
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [cohereToken, setCohereToken] = useState(null);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const mensajesRef = useRef(null);

  useEffect(() => {
    obtenerTokenCohere();
  }, []);

  const obtenerTokenCohere = async () => {
    try {
      const response = await axios.get('https://nodejs-restapi-mysql-fauno-production.up.railway.app/api/ai');
      const token = response.data;
      console.log(token);
      setCohereToken(token);
    } catch (error) {
      console.error('Error al obtener el token de la API:', error);
    }
  };

  const scrollToBottom = () => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || enviandoMensaje) return;
    setEnviandoMensaje(true);
    setMensajes(prevMensajes => [
      ...prevMensajes,
      { texto: nuevoMensaje, origen: 'usuario' }
    ]);
    setNuevoMensaje('');
    try {
      const respuestaCohere = await obtenerRespuestaCohere(nuevoMensaje);
      reproducirAudio(respuestaCohere);
    } finally {
      setEnviandoMensaje(false);
    }
  };

  const obtenerRespuestaCohere = async (userMessage) => {
    try {
      if (!cohereToken) {
        throw new Error('Token de Cohere no disponible');
      }

      const cohere = new CohereClient({
        token: cohereToken,
        language: "es",
        model: "command-r-plus",
      });

      setEscribiendo(true);
      const chatHistory = [
        { role: "SYSTEM", message: "sos un asistente virtual de Lennita BB! Somos un emprendimiento artesanal ubicado en Santa Clara del Mar, Argentina. Nos especializamos en la producción de adorables muñequitos de amigurumis hechos con mucho amor y dedicación. En Lennita BB, cada creación es única, diseñada para traer alegría y diversión a tu vida. Desde simpáticos animales hasta personajes fantásticos y figuras que vos quieras!, nuestros amigurumis son el regalo perfecto para todas las ocasiones. ¡Déjanos ser parte de tus momentos especiales con nuestros encantadores." },
        { role: "USER", message: userMessage }
      ];

      const response = await cohere.chat({
        message: userMessage,
        model: "command-r-plus",
        chat_history: chatHistory,
        language: "es",
      });

      setEscribiendo(false);
      console.log(response);
      return response.text;
    } catch (error) {
      console.error('Error al llamar a Cohere AI:', error);
      setEscribiendo(false);
      return 'Lo siento, hubo un problema al procesar tu solicitud.';
    }
  };

  const reproducirAudio = async (text) => {
    try {
      // Set your Hugging Face Token
      const hf = new HfInference("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");

      const response = await hf.textToSpeech({
        inputs: text,
        model: "ylacombe/mms-spa-finetuned-argentinian-monospeaker",
        language: "es", // Se corrige el typo "lenguage" a "language"
      });
      const audioElement = new Audio(URL.createObjectURL(response));
      audioElement.play();
    } catch (error) {
      console.error('Error al convertir texto a audio:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnviarMensaje();
    }
  };

  const handleChatToggle = () => {
    setChatAbierto(!chatAbierto);
  };

  const handleCloseChat = () => {
    setChatAbierto(false);
  };

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 9999 }}>
      <button onClick={handleChatToggle} className={`flex items-center justify-center bg-purple-300 rounded-full w-12 h-12 ${chatAbierto ? 'hidden' : ''}`}>
        <FiMessageSquare className="text-white text-2xl" />
      </button>
      {chatAbierto && (
        <div className="bg-purple-100 p-4 rounded-t-lg shadow-lg w-80">
          <div className="flex justify-between mb-2">
            <button onClick={handleCloseChat}><FiX className="text-gray-600" /></button>
          </div>
          <div ref={mensajesRef} className="h-60 overflow-y-auto mb-2">
            {mensajes.map((mensaje, index) => (
              <div key={index} className={`mb-2 ${mensaje.origen === 'usuario' ? 'text-right' : 'text-left'} px-4 py-2 rounded-lg bg-purple-200 text-gray-800`}>
                <strong>{mensaje.origen === 'usuario' ? 'Tú' : 'Asistente PhilosophIA'}</strong>: {mensaje.texto}
              </div>
            ))}
            {escribiendo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-2 text-left px-4 py-2 rounded-lg bg-purple-200"
              >
                <strong>Asistente PhilosophIA</strong>: ...
              </motion.div>
            )}
          </div>
          <div className="flex justify-between">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribí algo acá"
              className="flex-1 border rounded-full px-4 py-2 outline-none"
              disabled={enviandoMensaje}
            />
            <button onClick={handleEnviarMensaje} disabled={enviandoMensaje} className="ml-2 bg-purple-300 rounded-full px-4 py-2 text-white font-semibold">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
