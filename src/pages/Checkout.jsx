import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { createOrder, createRazorpayPaymentOrder, fetchCheckoutSummary, fetchStoreSettings, verifyRazorpayPayment } from '../services/api.js';
import { resolveImageUrl } from '../utils/imageUrl.js';

const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
  if (window.Razorpay) { resolve(); return; }
  const timeout = window.setTimeout(() => reject(new Error('Razorpay Checkout is taking too long to load. Check your internet connection and try again.')), 12000);
  const done = () => { window.clearTimeout(timeout); resolve(); };
  const fail = () => { window.clearTimeout(timeout); reject(new Error('Unable to load Razorpay Checkout. Check your internet connection.')); };
  const existing = document.querySelector('script[data-skyra-razorpay]');
  if (existing) { existing.addEventListener('load', done, { once: true }); existing.addEventListener('error', fail, { once: true }); return; }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.dataset.skyraRazorpay = 'true';
  script.onload = done;
  script.onerror = fail;
  document.head.appendChild(script);
});

const initialForm = {
  fullName: '',
  email: '',
  primaryMobile: '',
  secondaryMobile: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const indianMobile = (value = '') => { const digits=value.replace(/\D/g,''); return digits.length===12&&digits.startsWith('91')?digits.slice(2):digits; };

export default function Checkout() {
  const { profile, user, isAuthenticated, loginWithGoogle } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    fullName: profile?.name || user?.displayName || '',
    email: profile?.email || user?.email || '',
    primaryMobile: profile?.phone || '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [fieldErrors,setFieldErrors]=useState({});
  const [shippingRules, setShippingRules] = useState(null);

  const validItems = cart.items.filter((item) => item.product);
  const fallbackShippingCost = shippingRules
    ? (shippingRules.freeShippingAll || (shippingRules.freeShippingEnabled && cart.subtotal >= (shippingRules.freeShippingThreshold || 0)) ? 0 : Number(shippingRules.fixedShippingRate || 0))
    : 0;
  const displaySubtotal = summary?.subtotal ?? cart.subtotal;
  const displayShippingCost = summary?.shippingCost ?? fallbackShippingCost;
  const displayTotal = summary?.total ?? (displaySubtotal + displayShippingCost);

  const loadSummary = useCallback(async () => {
    if (validItems.length === 0) return;
    setSummaryLoading(true);
    setError('');
    try {
      const data = await fetchCheckoutSummary();
      setSummary(data);
    } catch (err) {
      setSummary(null);
      console.warn('Unable to calculate checkout totals from backend:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, [validItems.length]);

  useEffect(() => {
    queueMicrotask(() => loadSummary());
  }, [loadSummary, cart.itemCount, cart.subtotal]);

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        const data = await fetchStoreSettings();
        setShippingRules(data.shipping || {});
      } catch {
        setShippingRules({
          fixedShippingRate: 99,
          freeShippingEnabled: true,
          freeShippingThreshold: 1000,
          freeShippingAll: false,
        });
      }
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current)=>({...current,[name]:''}));
  };

  const openRazorpay = async (order) => {
    const payment = await createRazorpayPaymentOrder(order._id);
    if (!payment.keyId) throw new Error('Razorpay is not configured. Add test API keys to the backend environment.');
    await loadRazorpayCheckout();
    if (!window.Razorpay) throw new Error('Razorpay Checkout did not load. Please check your internet connection and try again.');
    await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.paymentOrder.amount,
        currency: payment.paymentOrder.currency || 'INR',
        name: 'SKYRA JEWELLERY',
        description: `Payment for ${order.orderNumber}`,
        order_id: payment.paymentOrder.id,
        prefill: { name: form.fullName.trim(), email: form.email.trim(), contact: form.primaryMobile.trim() },
        notes: { orderId: order._id, orderNumber: order.orderNumber },
        theme: { color: '#650018' },
        modal: { ondismiss: () => reject(new Error('Payment window closed. Your order is saved; use Retry Payment to continue.')) },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({ orderId: order._id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
            resolve();
          } catch (verificationError) { reject(verificationError); }
        },
      });
      checkout.on('payment.failed', (response) => reject(new Error(response.error?.description || 'Razorpay payment failed.')));
      checkout.open();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const errors={};
    if(form.fullName.trim().length<2)errors.fullName='Enter your full name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))errors.email='Enter a valid email address.';
    if(!/^[6-9]\d{9}$/.test(indianMobile(form.primaryMobile)))errors.primaryMobile='Enter a valid 10-digit Indian mobile number.';
    if(form.secondaryMobile.trim()&&!/^[6-9]\d{9}$/.test(indianMobile(form.secondaryMobile)))errors.secondaryMobile='Enter a valid 10-digit mobile number or leave it empty.';
    if(form.line1.trim().length<5)errors.line1='Enter a complete street address.';
    if(form.city.trim().length<2)errors.city='Enter your city.';
    if(form.state.trim().length<2)errors.state='Enter your state.';
    if(!/^\d{6}$/.test(form.pincode.trim()))errors.pincode='Enter a valid 6-digit pincode.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError('Please correct the highlighted delivery details.');
      requestAnimationFrame(()=>document.querySelector('.skyra-checkout__field-grid .is-invalid')?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        shippingAddress: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: indianMobile(form.primaryMobile),
          secondaryPhone: indianMobile(form.secondaryMobile),
          line1: form.line1.trim(),
          line2: form.line2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          notes: form.notes.trim(),
        },
        primaryMobile: indianMobile(form.primaryMobile),
        secondaryMobile: indianMobile(form.secondaryMobile),
        notes: form.notes.trim(),
        paymentProvider: 'razorpay',
      };
      const result = pendingOrder ? { order: pendingOrder } : await createOrder(payload);

      const order = result.order;
      if (!order?._id) throw new Error('The order could not be prepared for payment.');
      setPendingOrder(order);
      await openRazorpay(order);
      const orderNumber = order.orderNumber || '';
      setSuccess(`Payment received for order ${orderNumber}.`);
      setPendingOrder(null);
      await refreshCart();
      navigate('/orders', { state: { created: orderNumber, paid: true } });
    } catch (err) {
      setError(err.message || 'Unable to create order.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <section className="skyra-checkout section"><div className="skyra-checkout__signin"><span>◇</span><p>Secure checkout</p><h1>Sign in to continue</h1><small>Your order and payment will be securely linked to your SKYRA account.</small><button className="btn-primary" onClick={()=>loginWithGoogle().catch((err)=>setError(err.message))}>Continue with Google</button>{error&&<div className="auth-alert auth-alert--error">{error}</div>}<Link to="/cart">← Return to bag</Link></div></section>;
  }

  if (validItems.length === 0) {
    return (
      <section className="account-page section">
        <div className="account-container" style={{ textAlign: 'center' }}>
          <p className="auth-label">Checkout</p>
          <h1 className="profile-title">Your cart is empty</h1>
          <p className="auth-subtitle">Add a piece to your cart before checkout.</p>
          <Link to="/category-all" className="btn-primary">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="skyra-checkout section">
      <div className="skyra-checkout__container">
        <header className="skyra-checkout__header">
          <div><p>Secure checkout</p><h1>Complete your order</h1><span>Every SKYRA piece is carefully packed and fully insured in transit.</span></div>
          <div className="skyra-checkout__steps"><span className="is-done"><b>✓</b> Bag</span><i/><span className="is-active"><b>2</b> Delivery & payment</span><i/><span><b>3</b> Confirmation</span></div>
        </header>

        {error && <div className="auth-alert auth-alert--error">{error}</div>}
        {success && <div className="auth-alert auth-alert--success">{success}</div>}

        <div className="skyra-checkout__layout">
          <form className="auth-form skyra-checkout__form" onSubmit={handleSubmit}>
            <div className="skyra-checkout__section-title"><span>01</span><div><h2>Delivery details</h2><p>Fields marked with * are required.</p></div></div>
            <div className="skyra-checkout__field-grid">
            <div className="auth-field">
              <label htmlFor="checkout-fullName">Full Name *</label>
              <input id="checkout-fullName" name="fullName" className={`auth-input${fieldErrors.fullName?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.fullName)} value={form.fullName} onChange={handleChange} required />{fieldErrors.fullName&&<small className="checkout-field-error">{fieldErrors.fullName}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-email">Email *</label>
              <input id="checkout-email" name="email" type="email" className={`auth-input${fieldErrors.email?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.email)} value={form.email} onChange={handleChange} required />{fieldErrors.email&&<small className="checkout-field-error">{fieldErrors.email}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-primaryMobile">Primary Mobile *</label>
              <input id="checkout-primaryMobile" name="primaryMobile" type="tel" className={`auth-input${fieldErrors.primaryMobile?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.primaryMobile)} value={form.primaryMobile} onChange={handleChange} placeholder="98765 43210" required />{fieldErrors.primaryMobile&&<small className="checkout-field-error">{fieldErrors.primaryMobile}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-secondaryMobile">Secondary Mobile</label>
              <input id="checkout-secondaryMobile" name="secondaryMobile" type="tel" className={`auth-input${fieldErrors.secondaryMobile?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.secondaryMobile)} value={form.secondaryMobile} onChange={handleChange} />{fieldErrors.secondaryMobile&&<small className="checkout-field-error">{fieldErrors.secondaryMobile}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-line1">Address Line 1 *</label>
              <input id="checkout-line1" name="line1" className={`auth-input${fieldErrors.line1?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.line1)} value={form.line1} onChange={handleChange} required />{fieldErrors.line1&&<small className="checkout-field-error">{fieldErrors.line1}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-line2">Address Line 2</label>
              <input id="checkout-line2" name="line2" className="auth-input" value={form.line2} onChange={handleChange} />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-city">City *</label>
              <input id="checkout-city" name="city" className={`auth-input${fieldErrors.city?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.city)} value={form.city} onChange={handleChange} required />{fieldErrors.city&&<small className="checkout-field-error">{fieldErrors.city}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-state">State *</label>
              <input id="checkout-state" name="state" className={`auth-input${fieldErrors.state?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.state)} value={form.state} onChange={handleChange} required />{fieldErrors.state&&<small className="checkout-field-error">{fieldErrors.state}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-pincode">Pincode *</label>
              <input id="checkout-pincode" name="pincode" inputMode="numeric" maxLength="6" className={`auth-input${fieldErrors.pincode?' is-invalid':''}`} aria-invalid={Boolean(fieldErrors.pincode)} value={form.pincode} onChange={handleChange} required />{fieldErrors.pincode&&<small className="checkout-field-error">{fieldErrors.pincode}</small>}
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-notes">Address Notes</label>
              <textarea id="checkout-notes" name="notes" className="auth-input" rows="4" value={form.notes} onChange={handleChange} />
            </div>
            </div>
            <div className="skyra-checkout__section-title skyra-checkout__section-title--payment"><span>02</span><div><h2>Online payment</h2><p>Complete your payment securely with Razorpay.</p></div></div>
            <div className="checkout-payment-note"><span>✓</span><div><strong>Secure payment with Razorpay</strong><small>UPI, cards, netbanking, and supported wallets.</small></div></div>
            <button type="submit" className="btn-primary checkout-pay-button" disabled={submitting || summaryLoading}>
              {submitting ? 'Opening Razorpay…' : pendingOrder ? `Retry Razorpay · ${money.format(displayTotal)}` : `Pay Online · ${money.format(displayTotal)}`}
            </button>
          </form>

          <aside className="skyra-checkout__summary">
            <div className="skyra-checkout__summary-head"><div><p>Your selection</p><h2>Order summary</h2></div><button type="button" onClick={() => navigate('/cart')}>Edit bag</button></div>
            {validItems.map((item) => (
              <div key={item._id} className="skyra-checkout__item">
                {item.product.images?.[0]?.url?<img src={resolveImageUrl(item.product.images[0].url)} alt=""/>:<span className="skyra-checkout__item-placeholder">◇</span>}
                <div><strong>{item.product.name}</strong><small>{item.variantSku||'Classic selection'} · Qty {item.quantity}</small></div>
                <b>{money.format(item.priceAtAdd * item.quantity)}</b>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal</span>
              <strong>{money.format(displaySubtotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping</span>
              <strong>{displayShippingCost === 0 ? 'Complimentary' : money.format(displayShippingCost)}</strong>
            </div>
            <div className="skyra-checkout__total">
              <span>Grand Total</span>
              <strong>{money.format(displayTotal)}</strong>
            </div>
            <div className="skyra-checkout__trust"><span>♢</span><p><strong>SKYRA assurance</strong><small>Secure payment · Insured delivery · Thoughtful packaging</small></p></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
