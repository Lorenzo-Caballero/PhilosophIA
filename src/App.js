import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "./store/actions/products-actions";
import { AnimatePresence } from "framer-motion";
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from './pages/NotFound';
import LoginRedirect from "./components/auth/LoginRedirect";
import RegisterRedirect from "./components/auth/RegisterRedirect";
import HomeRedirect from "./components/auth/HomeRedirect";
import { AuthProvider } from "./components/context/AuthContext";



const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);


  return (
    <>
      <AuthProvider>


        <AnimatePresence exitBeforeEnter >

          <Routes location={location} key={location.pathname}>

            <Route element={<HomeRedirect />}>
              <Route path="/" element={<Home />} />
              <Route path="/PhilosophIA" element={<Home />} />

            </Route>

            <Route element={<LoginRedirect />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<RegisterRedirect />}>
              <Route path="/register" element={<Register />} />
            </Route>



            <Route path="*" element={<NotFound />} />

          </Routes>

        </AnimatePresence>

      </AuthProvider>

    </>
  );
}

export default App;
