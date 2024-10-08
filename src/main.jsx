import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./context/Firebase.context.jsx";
import { Toaster } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
const Root = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => setLoading(false);
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, []);

    if (loading) {
        return null;
    }

    return (
        <React.StrictMode>
            <BrowserRouter>
                <FirebaseProvider>
                    <App />
                    <Toaster richColors />
                </FirebaseProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
