import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Catalog from './pages/Catalog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Catalog />
            </>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <>
              <Header />
              <AdminDashboard />
            </>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
