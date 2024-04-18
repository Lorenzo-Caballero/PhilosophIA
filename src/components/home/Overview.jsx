import React, { useEffect,useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Overview = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5 // Cambia este valor según tus necesidades
    });

    // Actualizamos el estado isVisible cuando cambia inView
    useEffect(() => {
        setIsVisible(inView);
    }, [inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-[#f1f5f8] py-20 md:py-32 text-center"
        >
            <div className="px-3 lg:px-0 lg:w-[55%] mx-auto">
                <h2 className="font-extrabold text-5xl text-[#242833] capitalize mb-10 tracking-widest leading-10">Lennita BB</h2>
                <p className="text-lg text-[#555] tracking-widest font-normal mb-5 leading-7">¡Bienvenidos a Lennita BB! Somos un emprendimiento artesanal ubicado en Santa Clara del Mar, Argentina. Nos especializamos en la producción de adorables muñequitos de amigurumis hechos con mucho amor y dedicación. En Lennita BB, cada creación es única, diseñada para traer alegría y diversión a tu vida. Desde simpáticos animales hasta personajes fantásticos, nuestros amigurumis son el regalo perfecto para todas las ocasiones. ¡Déjanos ser parte de tus momentos especiales con nuestros encantadores muñequitos de amigurumis!</p>
                <ScrollLink className="inline-block px-6 py-3 font-semibold tracking-wider text-white bg-primary uppercase mt-8 text-lg hover:bg-secondary-200" to="about" smooth={true} duration={500}>
                    Más sobre nosotros
                </ScrollLink>
            </div>
        </motion.div>
    );
}; 

export default Overview;
