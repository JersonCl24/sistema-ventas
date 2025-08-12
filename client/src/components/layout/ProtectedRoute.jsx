import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. Si estamos cargando (verificando el token), mostramos un mensaje
    if (loading) {
        return <h1 className="text-2xl text-center mt-10">Cargando...</h1>;
    }

    // 2. Si no estamos cargando y el usuario NO está autenticado, lo redirigimos al login
    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si todo está bien, mostramos el contenido de la ruta solicitada
    return <Outlet />;
};

export default ProtectedRoute;