import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import PageTransition from './components/PageTransition';
import NewAdminGuard from './components/admin-new/NewAdminGuard.jsx';
import NewAdminLayout from './components/admin-new/NewAdminLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './index.css';
import './styles/admin.css';
import CategoryAll from './pages/CategoryAll';
import CategoryAnklets from './pages/CategoryAnklets';
import CategoryBracelets from './pages/CategoryBracelets';
import CategoryEarrings from './pages/CategoryEarrings';
import CategoryPendants from './pages/CategoryPendants';
import CategoryRings from './pages/CategoryRings';
import CategorySets from './pages/CategorySets';
import BackendCategory from './pages/BackendCategory';
import Home from './pages/Home';
import ProductAquaHeart from './pages/ProductAquaHeart';
import ProductAzuraSquare from './pages/ProductAzuraSquare';
import ProductClassicPayal from './pages/ProductClassicPayal';
import ProductElvaraPear from './pages/ProductElvaraPear';
import ProductEternaPearl from './pages/ProductEternaPearl';
import ProductGhunghrooPayal from './pages/ProductGhunghrooPayal';
import ProductHamsaPendant from './pages/ProductHamsaPendant';
import ProductLeafCrystal from './pages/ProductLeafCrystal';
import ProductLeharBangle from './pages/ProductLeharBangle';
import ProductLumeBracelet from './pages/ProductLumeBracelet';
import ProductNoorSet from './pages/ProductNoorSet';
import ProductOceanSolitaire from './pages/ProductOceanSolitaire';
import ProductOrbitCrystal from './pages/ProductOrbitCrystal';
import ProductRoseAmour from './pages/ProductRoseAmour';
import ProductSlimCrystal from './pages/ProductSlimCrystal';
import ProductSoleilBloom from './pages/ProductSoleilBloom';
import ProductSolitaireSpark from './pages/ProductSolitaireSpark';
import ProductRoseGoldSquare from './pages/ProductRoseGoldSquare';
import ProductTripleStone from './pages/ProductTripleStone';
import ProductZivaraBow from './pages/ProductZivaraBow';
import BackendProduct from './pages/BackendProduct';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import NewAdminDashboard from './pages/admin-new/NewAdminDashboard.jsx';
import ModernReports from './pages/admin-new/ModernReports.jsx';
import {
  AdminCustomers,
  AdminHomepage,
  AdminInvoices,
  AdminPayments,
  AdminRoles,
  AdminSearchResults,
  AdminShippingManager,
  AdminSiteSettings,
} from './pages/admin-new/AdminOperations.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import OurStory from './pages/OurStory';
import TermsUse from './pages/TermsUse';
import TermsPolicy from './pages/TermsPolicy';

function SuperadminOnly({ children }) {
  const { role } = useAuth();
  return role === 'superadmin' ? children : <Navigate to="/admin" replace />;
}

function LegacyProductRedirect() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/product-')) {
    return <Navigate to={`/product/${pathname.slice('/product-'.length)}`} replace />;
  }
  return null;
}

function StorefrontRoutes() {
  return (
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/category-all" element={<CategoryAll />} />
          <Route path="/category-anklets" element={<BackendCategory categorySlug="anklets" categoryName="Anklets" fallback={<CategoryAnklets />} />} />
          <Route path="/category-bracelets" element={<BackendCategory categorySlug="bracelets" categoryName="Bracelets" fallback={<CategoryBracelets />} />} />
          <Route path="/category-earrings" element={<BackendCategory categorySlug="earrings" categoryName="Earrings" fallback={<CategoryEarrings />} />} />
          <Route path="/category-pendants" element={<BackendCategory categorySlug="pendants" categoryName="Pendants" fallback={<CategoryPendants />} />} />
          <Route path="/category-rings" element={<BackendCategory categorySlug="rings" categoryName="Rings" fallback={<CategoryRings />} />} />
          <Route path="/category-sets" element={<BackendCategory categorySlug="sets" categoryName="Sets" fallback={<CategorySets />} />} />
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/product-aqua-heart" element={<BackendProduct slug="aqua-heart" fallback={<ProductAquaHeart />} />} />
          <Route path="/product-azura-square" element={<BackendProduct slug="azura-square" fallback={<ProductAzuraSquare />} />} />
          <Route path="/product-classic-payal" element={<BackendProduct slug="classic-payal" fallback={<ProductClassicPayal />} />} />
          <Route path="/product-elvara-pear" element={<BackendProduct slug="elvara-pear" fallback={<ProductElvaraPear />} />} />
          <Route path="/product-eterna-pearl" element={<BackendProduct slug="eterna-pearl" fallback={<ProductEternaPearl />} />} />
          <Route path="/product-ghunghroo-payal" element={<BackendProduct slug="ghunghroo-payal" fallback={<ProductGhunghrooPayal />} />} />
          <Route path="/product-hamsa-pendant" element={<BackendProduct slug="hamsa-pendant" fallback={<ProductHamsaPendant />} />} />
          <Route path="/product-leaf-crystal" element={<BackendProduct slug="leaf-crystal" fallback={<ProductLeafCrystal />} />} />
          <Route path="/product-lehar-bangle" element={<BackendProduct slug="lehar-bangle" fallback={<ProductLeharBangle />} />} />
          <Route path="/product-lume-bracelet" element={<BackendProduct slug="lume-bracelet" fallback={<ProductLumeBracelet />} />} />
          <Route path="/product-noor-set" element={<BackendProduct slug="noor-set" fallback={<ProductNoorSet />} />} />
          <Route path="/product-ocean-solitaire" element={<BackendProduct slug="ocean-solitaire" fallback={<ProductOceanSolitaire />} />} />
          <Route path="/product-orbit-crystal" element={<BackendProduct slug="orbit-crystal" fallback={<ProductOrbitCrystal />} />} />
          <Route path="/product-rose-amour" element={<BackendProduct slug="rose-amour" fallback={<ProductRoseAmour />} />} />
          <Route path="/product-slim-crystal" element={<BackendProduct slug="slim-crystal" fallback={<ProductSlimCrystal />} />} />
          <Route path="/product-soleil-bloom" element={<BackendProduct slug="soleil-bloom" fallback={<ProductSoleilBloom />} />} />
          <Route path="/product-solitaire-spark" element={<BackendProduct slug="solitaire-spark" fallback={<ProductSolitaireSpark />} />} />
          <Route path="/product-triple-stone" element={<BackendProduct slug="triple-stone" fallback={<ProductTripleStone />} />} />
          <Route path="/product-rose-gold-square" element={<BackendProduct slug="rose-gold-square" fallback={<ProductRoseGoldSquare />} />} />
          <Route path="/product-zivara-bow" element={<BackendProduct slug="zivara-bow" fallback={<ProductZivaraBow />} />} />
          <Route path="/product/:slug" element={<BackendProduct />} />
          <Route path="*" element={<LegacyProductRedirect />} />
          <Route path="/account" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Navigate to="/" replace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/terms-use" element={<TermsUse />} />
          <Route path="/terms-policy" element={<TermsPolicy />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(() => {
    const path = window.location.pathname;
    return path === '/' || path === '/index.html' || path === '/react-version/' || path === '/react-version';
  });

  useEffect(() => {
    if (!isLoading) {
      document.body.classList.remove('no-scroll');
      return;
    }

    document.body.classList.add('no-scroll');

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('no-scroll');
    };
  }, [isLoading]);

  return (
    <BrowserRouter>
      {isLoading && <Loader />}
      <Routes>
        <Route element={<NewAdminGuard />}>
          <Route path="/admin" element={<NewAdminLayout />}>
            <Route index element={<NewAdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="shipping" element={<AdminShippingManager />} />
            <Route path="users" element={<AdminCustomers />} />
            <Route path="admins" element={<SuperadminOnly><AdminRoles /></SuperadminOnly>} />
            <Route path="settings" element={<SuperadminOnly><AdminSiteSettings /></SuperadminOnly>} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="reports" element={<ModernReports />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="search" element={<AdminSearchResults />} />
          </Route>
        </Route>
        <Route path="/*" element={<StorefrontRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
