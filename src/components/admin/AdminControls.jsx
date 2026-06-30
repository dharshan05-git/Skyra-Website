import { useEffect } from 'react';

export function Toggle({ checked, onChange, label, disabled = false }) {
  return <label className={`admin-toggle${disabled ? ' admin-toggle--disabled' : ''}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled}/><span className="admin-toggle__track"><span/></span>{label&&<span className="admin-toggle__label">{label}</span>}</label>;
}

export function Modal({ open, onClose, title, eyebrow, children, wide = false }) {
  useEffect(() => { if (!open) return undefined; const close = (event) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open, onClose]);
  if (!open) return null;
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`admin-modal${wide ? ' admin-modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><header className="admin-modal__header"><div><p className="admin-eyebrow">{eyebrow}</p><h2 id="admin-modal-title">{title}</h2></div><button type="button" onClick={onClose} aria-label="Close dialog">×</button></header><div className="admin-modal__body">{children}</div></section></div>;
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Archive', busy = false }) {
  return <Modal open={open} onClose={onClose} title={title} eyebrow="Please confirm"><div className="admin-confirm"><span>!</span><p>{message}</p><div className="admin-form-actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose} disabled={busy}>Cancel</button><button type="button" className="admin-button admin-button--danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button></div></div></Modal>;
}

export function PageState({ type = 'empty', title, message, action }) {
  return <div className={`admin-collection-state admin-collection-state--${type}`}><span>{type === 'error' ? '!' : type === 'empty' ? '◇' : '✦'}</span><h2>{title}</h2><p>{message}</p>{action}</div>;
}
