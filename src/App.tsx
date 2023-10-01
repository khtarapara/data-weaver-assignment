import React from "react";
import Router from "./Router";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Router />
    </Provider>
  );
}
