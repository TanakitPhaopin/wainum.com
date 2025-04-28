import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace/>
}