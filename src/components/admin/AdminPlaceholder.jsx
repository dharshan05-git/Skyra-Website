import { Link } from 'react-router-dom';

export default function AdminPlaceholder({ eyebrow='Administration', title, description, actionLabel, actionTo='/admin' }) {
  return <section className="admin-page"><header className="admin-page-header"><div><p className="admin-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></header><div className="admin-empty admin-empty--large"><span className="admin-empty__gem">✦</span><h2>{title} workspace is ready</h2><p>The navigation and page framework are in place. Data tools and forms arrive in the next implementation phase.</p>{actionLabel&&<Link className="admin-button admin-button--secondary" to={actionTo}>{actionLabel}</Link>}</div></section>;
}
