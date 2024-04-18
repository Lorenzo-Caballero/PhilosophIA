import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import TheSpinner from '../layout/TheSpinner';
import { getProductDetails } from "../store/actions/products-actions.js";
import PageHero from "../layout/PageHero.jsx";

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

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.ui.productDetailLoading);

    const [precio, setPrecio] = useState(0);

    useEffect(() => {
        dispatch(getProductDetails(productId));
    }, [dispatch, productId]);

    const product = useSelector((state) => state.products.productDetails);
    const {
        name,
        description,
        price,
        brand,
        sku,
        image,
    } = product;

    useEffect(() => {
        // Setear el precio para el pago
        setPrecio(price);
    }, [price]);

    // Función para procesar el pago por MercadoPago
    const handlePayment = async () => {
        try {
            const response = await axios.post('https://api.mercadopago.com/v1/advanced_payments', {
                binary_mode: false,
                capture: false,
                payer: {
                    token: 'abcdef1e23f4567d8e9123eb6591ff68df74c57930551ed980239f4538a7e530',
                    type_token: 'wallet-tokens'
                },
                wallet_payment: {
                    transaction_amount: precio,
                    description: 'Payment for the purchase of furniture',
                    external_reference: 'Payment_seller_123',
                    discount: {
                        amount: 10,
                        description: 'DESC20',
                        code: null,
                        detail: {
                            cap: 1000000,
                            type: 'percentage',
                            value: 10
                        }
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer TU_ACCESS_TOKEN' // Reemplaza con tu token de acceso de MercadoPago
                }
            });
            console.log(response.data);
            // Aquí puedes manejar la respuesta del pago
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            // Aquí puedes manejar los errores del pago
        }
    };

    return (
        <motion.div className='mb-48'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <PageHero title={name} product />
            <div className='mt-16 space-y-16 w-full px-4 md:px-8 lg:px-0 mx-auto max-w-screen-xl'>
                <Link to='/products' className='uppercase bg-purple-500 px-4 py-2 rounded text-white font-semibold shadow-lg'>
                    back to products
                </Link>
                {loading ? <TheSpinner /> :
                    <div className='flex'>
                        <div className='w-1/2 pr-8'>
                            <img
                                src={image}
                                alt=""
                                className="w-full rounded-lg md:max-w-md lg:max-w-lg"
                            />
                        </div>

                        <div className='w-1/2'>
                            <h2 className='font-bold text-5xl tracking-wide mb-5'>{name}</h2>
                            <h4 className='text-xl font-extrabold text-purple-500 tracking-widest italic my-4'>${price}</h4>
                            <p className='max-w-3xl tracking-wider leading-8 text-gray-500 mb-6'>{description}</p>
                            <div className='flex flex-col w-full sm:w-3/4 lg:w-1/2 space-y-5'>
                                <div className='flex justify-between'>
                                    <p className='text-lg font-semibold tracking-wider text-gray-600'>Disponible :</p>
                                    <p>En stock</p>
                                </div>
                            </div>
                            <hr className='my-6' />
                            {/* Botón de MercadoPago */}
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handlePayment}
                            >
                                Pagar con MercadoPago
                            </button>
                        </div>
                    </div>
                }
            </div>
        </motion.div>
    );
};

export default ProductDetail;
