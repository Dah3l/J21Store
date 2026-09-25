import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Catalog from './pages/Catalog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <BusinessProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Catalog />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <div className="min-h-screen">
                <Header />
                <AdminDashboard />
              </div>
            } />
          </Routes>
        </CartProvider>
      </BusinessProvider>
    </BrowserRouter>
  );
}

export default App;
