import React from "react";
import {GiDiamondHard, GiStabbedNote } from 'react-icons/gi';
import { IoCardOutline } from "react-icons/io5";
import { HiOutlineTruck } from "react-icons/hi";

const TheServices = () => {
    return (
        <div className="bg-purple-400 px-8 py-16 lg:py-24">
            <div className="container mx-auto">
                <h2 className="text-3xl lg:text-4xl text-white font-semibold mb-8">Descubre nuestros servicios</h2>
                <p className="text-lg text-white mb-12">¡Bienvenido a LennitaBB! Aquí te explicamos cómo trabajamos y qué servicios ofrecemos para que disfrutes al máximo de nuestros amigurumis personalizados.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceCard
                        icon={<IoCardOutline className="text-white text-4xl" />}
                        title="Método de pago seguro"
                        description="En LennitaBB, te ofrecemos un método de pago seguro para todas tus compras. Aceptamos todas las principales tarjetas de crédito y débito, así como MercadoPago y transferencias bancarias."
                    />
                    <ServiceCard
                        icon={<HiOutlineTruck className="text-white text-4xl" />}
                        title="Envío rápido y confiable"
                        description="Garantizamos un envío rápido y confiable para que recibas tus amigurumis personalizados en perfectas condiciones y en el menor tiempo posible. Trabajamos con los mejores servicios de mensajería para tu tranquilidad."
                    />
                    <ServiceCard
                        icon={<GiStabbedNote className="text-white text-4xl" />}
                        title="Amigurumis personalizados"
                        description="En LennitaBB, nos especializamos en la creación de amigurumis personalizados según tus gustos y preferencias. ¡Cuéntanos tu idea y nosotros la convertiremos en un adorable muñeco de ganchillo!"
                    />
                </div>
            </div>
        </div>
    );
};

const ServiceCard = ({ icon, title, description }) => {
    return (
        <div className="bg-purple-600 px-8 py-12 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl lg:text-2xl text-white font-bold mb-3">{title}</h3>
            <p className="text-gray-300">{description}</p>
        </div>
    );
};

export default TheServices;
