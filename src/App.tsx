import React from "react";
import Router from "./Router";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { ToastContainer } from "react-toastify";
import { theme } from "./theme";

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
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
      </ConfigProvider>
    </Provider>
  );
}
