
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast'; // 1. Importamos el Toaster

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
            {/* 2. Añadimos el componente Toaster aquí. Podemos configurarlo. */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </div>
    );
};

export default MainLayout;
