import {Routes, Route} from 'react-router-dom'; 
import { useAuth } from './context/AuthContext.jsx'; 
// Layouts
import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
// Páginas
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx'; 
import NewSalePage from './pages/NewSalePage.jsx'; 
import SalesHistoryPage from './pages/SalesHistoryPage.jsx';
import SaleDetailPage from './pages/SaleDetailPage.jsx';
import ProductManagementPage from './pages/ProductManagementPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import ClientManagementPage from './pages/ClientManagementPage.jsx'; 
import ClientFormPage from './pages/ClientFormPage.jsx';        
import ProveedorManagementPage from './pages/ProveedorManagementPage.jsx';  
import ProveedorFormPage from './pages/ProveedorFormPage.jsx';      
import GastoManagementPage from './pages/GastoManagementPage.jsx'; 
import GastoFormPage from './pages/GastoFormPage.jsx';       
import CategoriaManagementPage from './pages/CategoriaManagementPage'; 
import CategoriaFormPage from './pages/CategoriaFormPage.jsx';       
import DashboardPage from './pages/DashboardPage.jsx'; 
import FinancialSummaryPage from './pages/FinancialSummaryPage.jsx'; 
import CajaPage from './pages/CajaPage.jsx'; 
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
                <Route path="/catalogo" element={<HomePage />} />
                <Route path="/ventas/nueva" element={<NewSalePage />} />
                <Route path="/ventas" element={<SalesHistoryPage />} />
                <Route path="/ventas/:id" element={<SaleDetailPage />} />
                <Route path="/productos" element={<ProductManagementPage />} />
                <Route path="/productos" element={<ProductManagementPage />} />
                <Route path="/productos/nuevo" element={<ProductFormPage />} />
                <Route path="/productos/editar/:id" element={<ProductFormPage />} />
                <Route path="/clientes" element={<ClientManagementPage />} />
                <Route path="/clientes/nuevo" element={<ClientFormPage />} />
                <Route path="/clientes/editar/:id" element={<ClientFormPage />} />
                <Route path="/proveedores" element={<ProveedorManagementPage />} />
                <Route path="/proveedores/nuevo" element={<ProveedorFormPage />} />
                <Route path="/proveedores/editar/:id" element={<ProveedorFormPage />} />
                <Route path="/gastos" element={<GastoManagementPage />} />
                <Route path="/gastos/nuevo" element={<GastoFormPage />} />
                <Route path="/gastos/editar/:id" element={<GastoFormPage />} />
                <Route path="/categorias" element={<CategoriaManagementPage />} />
                <Route path="/categorias/nueva" element={<CategoriaFormPage />} />
                <Route path="/categorias/editar/:id" element={<CategoriaFormPage />} />
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