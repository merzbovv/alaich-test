import {Outlet, Navigate} from "react-router-dom";

export default function ProtectedRoute()
{
  const token = localStorage.getItem('token');
  // Если токен есть, рендерим дочерний маршрут, если нет - редиректим на /sign_in
  return token ? <Outlet/> : <Navigate to="/sign_in"/>;
};