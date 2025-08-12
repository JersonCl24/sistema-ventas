
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; // Asegúrate que la ruta sea correcta
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Truck, 
    CreditCard, 
    ShoppingCart, 
    BarChart3, 
    BookOpen,
    Banknote,
    DollarSign, // <-- Se añade el icono que faltaba
    LogOut
} from 'lucide-react';

// Lista de enlaces de navegación para mantener el código limpio
const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Catálogo', path: '/catalogo', icon: BookOpen },
    { name: 'Productos', path: '/productos', icon: Package },
    { name: 'Categorías', path: '/categorias', icon: BarChart3 },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Proveedores', path: '/proveedores', icon: Truck },
    { name: 'Gastos', path: '/gastos', icon: CreditCard },
    { name: 'Ventas', path: '/ventas', icon: ShoppingCart },
    { name: 'Resumen Financiero', path: '/financials', icon: Banknote },
    { name: 'Caja', path: '/caja', icon: DollarSign } // <-- Enlace de Caja integrado
];

const Sidebar = () => {
    const { logout, user } = useAuth();

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col p-4 border-r border-slate-800">
            <div className="text-2xl font-bold mb-10 text-white text-center">
                Sistema Ventas
            </div>
            
            <nav className="flex flex-col gap-2 flex-grow">
                {navLinks.map(link => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-blue-600 text-white' 
                                : 'hover:bg-slate-700/50'
                            }`
                        }
                    >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
                <NavLink
                    to="/ventas/nueva"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                >
                    <ShoppingCart size={20} />
                    <span>Registrar Venta</span>
                </NavLink>

                <div className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-blue-400">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm font-semibold text-white">{user?.nombre || 'Usuario'}</p>
                    </div>
                    <button onClick={logout} className="p-2 text-slate-400 hover:text-white" title="Cerrar Sesión">
                        <LogOut size={20}/>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;