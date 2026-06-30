import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchStoreSettings } from '../services/api.js';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [checkoutError, setCheckoutError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#faf3ee';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        const data = await fetchStoreSettings();
        setShipping(data.shipping || {});
      } catch {
        setShipping({
          fixedShippingRate: 99,
          freeShippingEnabled: true,
          freeShippingThreshold: 1000,
          freeShippingAll: false
        });
      }
    });
  }, []);

  const handleCheckoutRedirect = async () => {
    setCheckoutError('');
    if (isAuthenticated) {
      navigate('/checkout');
      return;
    }
    setSigningIn(true);
    try {
      await loginWithGoogle();
      navigate('/checkout');
    } catch (error) {
      setCheckoutError(error.message || 'Sign in is required to continue to checkout.');
    } finally {
      setSigningIn(false);
    }
  };

  const validItems = cart.items.filter((item) => item.product);
  
  const qualifiesForFreeShipping = shipping && (
    shipping.freeShippingAll || (shipping.freeShippingEnabled && cart.subtotal >= (shipping.freeShippingThreshold || 0))
  );
  const shippingCost = shipping ? (qualifiesForFreeShipping ? 0 : Number(shipping.fixedShippingRate || 0)) : null;
  const grandTotal = cart.subtotal + (shippingCost || 0);

  if (loading && cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--maroon)' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif' }}>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper" style={{ minHeight: '85vh', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="cart-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', marginBottom: '40px', color: 'var(--maroon)', textAlign: 'center' }}>
          Your Cart
        </h1>
        
        {validItems.length === 0 ? (
          <div className="empty-cart-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <svg viewBox="0 0 24 24" width="60" height="60" style={{ color: 'var(--maroon)', marginBottom: '20px' }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', marginBottom: '10px' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '30px', fontSize: '15px' }}>Add some beautiful pieces to your collection.</p>
            <Link
              to="/category-all"
              style={{
                display: 'inline-block',
                padding: '12px 35px',
                background: 'var(--maroon)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '15px',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {validItems.map((item) => {
                const product = item.product;
                const img = product.images && product.images.length
                  ? product.images.find((i) => i.isPrimary) || product.images[0]
                  : null;
                return (
                  <div 
                    key={item._id} 
                    style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      border: '1px solid rgba(0,0,0,0.04)', 
                      borderRadius: '8px', 
                      padding: '20px',
                      background: '#fff',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ width: '90px', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #f3ebe6', flexShrink: 0 }}>
                      {img ? (
                        <img src={img.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ background: '#f5f5f5', width: '100%', height: '100%' }} />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontFamily: 'Outfit, sans-serif', color: 'var(--gray-800)' }}>
                          {product.name}
                        </h4>
                        {item.variantSku && (
                          <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: '0 0 5px 0' }}>
                            Style: <span style={{ fontWeight: '500' }}>{item.variantSku}</span>
                          </p>
                        )}
                        <p style={{ fontWeight: '600', color: 'var(--maroon)', margin: 0 }}>
                          {money.format(item.priceAtAdd)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
                          <button 
                            onClick={() => updateQty(item._id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
                          >
                            -
                          </button>
                          <span style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item._id)}
                          style={{ 
                            border: 'none', 
                            background: 'none', 
                            color: 'var(--maroon)', 
                            fontSize: '13px', 
                            cursor: 'pointer',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <button 
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--gray-600)',
                  width: 'fit-content',
                  alignSelf: 'flex-end',
                  marginTop: '10px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--maroon)'; e.currentTarget.style.color = 'var(--maroon)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.color = 'var(--gray-600)'; }}
              >
                Clear Cart
              </button>
            </div>
            <div 
              style={{ 
                border: '1px solid rgba(0,0,0,0.03)', 
                borderRadius: '8px', 
                padding: '25px', 
                background: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', margin: '0 0 10px 0', color: 'var(--maroon)' }}>
                Order Summary
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: 'var(--gray-600)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '600', color: '#000' }}>{money.format(cart.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: 'var(--gray-600)' }}>
                <span>Shipping</span>
                <span>
                  {shippingCost === null ? (
                    'Calculating…'
                  ) : shippingCost === 0 ? (
                    <span style={{ color: 'green', fontWeight: '600' }}>FREE</span>
                  ) : (
                    money.format(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && shipping?.freeShippingEnabled && shipping.freeShippingThreshold > cart.subtotal && (
                <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: '-10px 0 0 0', lineHeight: '1.4' }}>
                  Add <strong>{money.format(shipping.freeShippingThreshold - cart.subtotal)}</strong> more to get <strong>Free Shipping!</strong>
                </p>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--maroon)' }}>{money.format(grandTotal)}</span>
              </div>

              {checkoutError && (
                <p style={{ fontSize: '12px', color: '#a93642', lineHeight: '1.5', margin: '5px 0 0 0' }}>
                  {checkoutError}
                </p>
              )}
              <button 
                onClick={() => handleCheckoutRedirect().catch(() => {})}
                disabled={signingIn}
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  background: 'var(--maroon)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  marginTop: '10px',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {signingIn ? 'SIGNING IN…' : 'PROCEED TO CHECKOUT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
