import {Routes, Route} from 'react-router-dom'; // Usamos Routes y Route para manejar las rutas
import { useAuth } from './context/AuthContext.jsx'; // Importamos useAuth para la lógica condicional
// Layouts
import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
// Páginas
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx'; // Importamos nuestro componente HomePage
import NewSalePage from './pages/NewSalePage.jsx'; // Importamos nuestro componente NewSalePage
//import Navbar from './components/common/Navbar.jsx'; // Importamos nuestro componente Navbar
import SalesHistoryPage from './pages/SalesHistoryPage.jsx';
import SaleDetailPage from './pages/SaleDetailPage.jsx';
import ProductManagementPage from './pages/ProductManagementPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import ClientManagementPage from './pages/ClientManagementPage.jsx'; // <-- 1. Importa la página de gestión
import ClientFormPage from './pages/ClientFormPage.jsx';       // <-- 2. Importa la página de formulario
import ProveedorManagementPage from './pages/ProveedorManagementPage.jsx'; // <-- 1. Importa la página de gestión
import ProveedorFormPage from './pages/ProveedorFormPage.jsx';       // <-- 2.
import GastoManagementPage from './pages/GastoManagementPage.jsx'; // <-- 1. Importa la página de gestión
import GastoFormPage from './pages/GastoFormPage.jsx';       // <-- 2. Importa la página de formulario
import CategoriaManagementPage from './pages/CategoriaManagementPage'; // <-- 1. Importa la página de gestión
import CategoriaFormPage from './pages/CategoriaFormPage.jsx';       // <-- 2. Importa la página de formulario
import DashboardPage from './pages/DashboardPage.jsx'; // <-- 1. Importa la página del Dashboard
import FinancialSummaryPage from './pages/FinancialSummaryPage.jsx'; // <-- 1. Importa la página del Resumen Financiero
import CajaPage from './pages/CajaPage.jsx'; // 1. Importa la página
import RegisterPage from './pages/RegisterPage.jsx';


function App () {
  const { isAuthenticated } = useAuth();
    return (
          <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                <Route path="/*" element={
                  <MainLayout>             
                <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/catalogo" element={<HomePage />} /> {/* Renderizamos el componente HomePage cuando la ruta es / */}
                <Route path="/ventas/nueva" element={<NewSalePage />} /> {/* Renderizamos el componente NewSalePage cuando la ruta es /ventas/nueva */}
                <Route path="/ventas" element={<SalesHistoryPage />} /> {/* <-- 2. Añade la nueva ruta */}
                <Route path="/ventas/:id" element={<SaleDetailPage />} /> {/* <-- 2. Añade la ruta dinámica */}
                <Route path="/productos" element={<ProductManagementPage />} /> {/* Ruta para la gestión de productos */}
                <Route path="/productos" element={<ProductManagementPage />} />
                <Route path="/productos/nuevo" element={<ProductFormPage />} /> {/* <-- 2. Ruta para añadir */}
                <Route path="/productos/editar/:id" element={<ProductFormPage />} /> {/* <-- 3. Ruta para editar */}
                {/* NUEVAS RUTAS PARA CLIENTES */}
                <Route path="/clientes" element={<ClientManagementPage />} />       {/* <-- 3. Ruta para listar */}
                <Route path="/clientes/nuevo" element={<ClientFormPage />} />       {/* <-- 4. Ruta para añadir */}
                <Route path="/clientes/editar/:id" element={<ClientFormPage />} />   {/* <-- 5. Ruta para editar */}
                 {/* NUEVAS RUTAS PARA PROVEEDORES */}
                <Route path="/proveedores" element={<ProveedorManagementPage />} />       {/* <-- 3. Ruta para listar */}
                <Route path="/proveedores/nuevo" element={<ProveedorFormPage />} />       {/* <-- 4. Ruta para añadir */}
                <Route path="/proveedores/editar/:id" element={<ProveedorFormPage />} />   {/* <-- 5. Ruta para editar */}
                 {/* NUEVAS RUTAS PARA GASTOS */}
                <Route path="/gastos" element={<GastoManagementPage />} />       {/* <-- 3. Ruta para listar */}
                <Route path="/gastos/nuevo" element={<GastoFormPage />} />       {/* <-- 4. Ruta para añadir */}
                <Route path="/gastos/editar/:id" element={<GastoFormPage />} />   {/* <-- 5. Ruta para editar */}
                {/* NUEVAS RUTAS PARA CATEGORÍAS */}
                <Route path="/categorias" element={<CategoriaManagementPage />} />       {/* <-- 3. Ruta para listar */}
                <Route path="/categorias/nueva" element={<CategoriaFormPage />} />       {/* <-- 4. Ruta para añadir */}
                <Route path="/categorias/editar/:id" element={<CategoriaFormPage />} />   {/* <-- 5. Ruta para editar */}
                  <Route path="/caja" element={<CajaPage />} /> 
                <Route path='/financials' element={<FinancialSummaryPage />} />
                
              </Routes>
              </MainLayout>
            } />
            </Route>
          </Routes>         
    );
};

export default App; 