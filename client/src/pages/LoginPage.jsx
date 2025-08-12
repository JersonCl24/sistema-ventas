
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react'; // Cambiado User por Mail

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signin, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signin(data);
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (error) {
            // El toast de error ya se muestra en el AuthContext.
            console.error("Fallo el inicio de sesión:", error);
        }
    });

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl mx-auto">
                <div className="hidden lg:flex flex-col justify-center items-start p-12">
                    <h1 className="text-5xl font-bold mb-4">Sistema de Ventas</h1>
                    <p className="text-slate-400 text-lg">Gestiona tu negocio de forma eficiente y profesional.</p>
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md animate-fade-in-up">
                        <form onSubmit={onSubmit} className="bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700 space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-white">Iniciar Sesión</h2>
                                <p className="mt-2 text-sm text-slate-400">Bienvenido de nuevo</p>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input type="email" {...register("email", { required: "El correo es requerido" })} className="w-full bg-slate-700/50 text-white p-3 pl-10 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Correo electrónico" />
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input type="password" {...register("password", { required: "La contraseña es requerida" })} className="w-full bg-slate-700/50 text-white p-3 pl-10 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contraseña" />
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
                            </div>
                            <div className="text-right text-sm">
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">¿Olvidaste tu contraseña?</a>
                            </div>
                            <div>
                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400/50">
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                    <LogIn size={18} />
                                </button>
                            </div>
                            <div className="text-center text-sm text-slate-400">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">Regístrate</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;