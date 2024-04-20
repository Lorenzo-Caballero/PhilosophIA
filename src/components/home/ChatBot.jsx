import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { CohereClient } from "cohere-ai";
import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import { FiX } from 'react-icons/fi';
import Tales from "./Tales.jsx";

const ChatButton = () => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [cohereToken, setCohereToken] = useState(null);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [reproduciendoVoz, setReproduciendoVoz] = useState(false);
  const [mostrarPensando, setMostrarPensando] = useState(false); // Nuevo estado
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
    try {
      setMostrarPensando(true); // Mostrar el mensaje "Pensando..." cuando el usuario envía un mensaje
      const respuestaCohere = await obtenerRespuestaCohere(nuevoMensaje);
      setMensajes(prevMensajes => [
        ...prevMensajes,
        { texto: respuestaCohere, origen: 'asistente' }
      ]);
      setNuevoMensaje('');
      reproducirAudio(respuestaCohere); // Reproducir audio después de enviar el mensaje del usuario
    } finally {
      setEnviandoMensaje(false);
      setMostrarPensando(false); // Ocultar el mensaje "Pensando..." cuando se completa el envío
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
        { role: "SYSTEM", message: "sos un filosofo, un genio de la filosofia , y debes responder solo dentro del contexto filosofico o sociologico. tus preguntas deben ser concisas y breves , el usuario se llama Paloma asi que llamala asi" },
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
      const hf = new HfInference("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");

      const response = await hf.textToSpeech({
        inputs: text,
        model: "ylacombe/mms-spa-finetuned-chilean-monospeaker",
        config_name: "male",
        language: "es",
      });
      const audioElement = new Audio(URL.createObjectURL(response));
      audioElement.play();
      audioElement.addEventListener('ended', () => {
        setReproduciendoVoz(false);
      });
      setReproduciendoVoz(true); // Establecer reproduciendoVoz en true al iniciar la reproducción
    } catch (error) {
      console.error('Error al convertir texto a audio:', error);
    }
  };

  return (
    <div className="relative">
      {showChat && (
  <div className="fixed bottom-60 lg:bottom-20 left-1/2 transform -translate-x-1/2">
  <div ref={mensajesRef} className="h-64 sm:h-36  mb-4">
            {mensajes.map((mensaje, index) => (
              mensaje.origen === 'usuario' && (
                <motion.div
                  key={index}
                  initial={{ opacity: 1, y: 20 }}
                  animate={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-purple-200 rounded-lg text-gray-800 py-2 px-4 mb-2`}
                >
                  {mensaje.texto}
                </motion.div>
              )
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribí algo acá <3"
              className="border rounded-full px-4 py-2 outline-none mb-2 sm:mb-0 w-full sm:w-4/5"
              style={{ maxWidth: '80%' }} // Ajuste de ancho máximo
              disabled={enviandoMensaje} // Deshabilitar input mientras se envía un mensaje
            />
            <button onClick={handleEnviarMensaje} disabled={enviandoMensaje} className="bg-purple-300 rounded-full px-3 py-1 text-white font-semibold w-full sm:w-auto">
              Enviar
            </button>
          </div>
        </div>
      )}
{mostrarPensando && (
  <motion.div
    className="absolute top-40 lg:top-40 right-60 lg:right-60 sm:right-60 sm:top-60 lg:mt-2 sm:mt-4 mr-4 bg-gray-800 bg-opacity-50 text-white rounded-full px-2 py-1 z-10 text-xs sm:text-sm md:text-base lg:text-lg"
    style={{ zIndex: 1 }}
  >
    Pensando...
  </motion.div>
)}


      <Tales  /> {/* Pasar el estado reproduciendoVoz como prop */}
    </div>
  );
};

export default ChatButton;
