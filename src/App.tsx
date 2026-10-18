import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import NotFoundPage from './components/NotFoundPage';

// Pages
import HomePage from './pages/HomePage';
import BrandLandingPage from './pages/BrandLandingPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />

            {/* Aurelle routes */}
            <Route path="/aurelle" element={<BrandLandingPage brandId="aurelle" />} />
            <Route path="/aurelle/engagement-rings" element={<ProductListingPage brandId="aurelle" />} />
            <Route path="/aurelle/engagement-rings/:slug" element={<ProductDetailPage brandId="aurelle" />} />

            {/* Gemma & Grove routes */}
            <Route path="/gemma-grove" element={<BrandLandingPage brandId="gemma-grove" />} />
            <Route path="/gemma-grove/gemstone-rings" element={<ProductListingPage brandId="gemma-grove" />} />
            <Route path="/gemma-grove/gemstone-rings/:slug" element={<ProductDetailPage brandId="gemma-grove" />} />

            {/* Lustre routes */}
            <Route path="/lustre" element={<BrandLandingPage brandId="lustre" />} />
            <Route path="/lustre/moissanite-rings" element={<ProductListingPage brandId="lustre" />} />
            <Route path="/lustre/moissanite-rings/:slug" element={<ProductDetailPage brandId="lustre" />} />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}

export default App
