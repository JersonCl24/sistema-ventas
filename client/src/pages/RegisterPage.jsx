
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';


const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signup(data);
            navigate('/');
        } catch (error) {
            console.error("Fallo el registro:", error);
        }
    });

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center font-sans">
            <div className="w-full max-w-md animate-fade-in-up p-8">
                <form onSubmit={onSubmit} className="bg-slate-800/50 p-8 rounded-lg shadow-2xl border border-slate-700 space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white">Crear una Cuenta</h2>
                        <p className="mt-2 text-sm text-slate-400">Únete para empezar a gestionar tu negocio</p>
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input type="text" {...register("nombre", { required: "El nombre es requerido" })} className="w-full bg-slate-700/50 text-white p-3 pl-10 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre completo" />
                        </div>
                        {errors.nombre && <p className="text-red-400 text-xs mt-1 ml-1">{errors.nombre.message}</p>}
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
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400/50">
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                            <UserPlus size={18} />
                        </button>
                    </div>
                    <div className="text-center text-sm text-slate-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">Inicia Sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RegisterPage;