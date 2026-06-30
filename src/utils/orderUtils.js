export const statusLabel = (status = 'pending') => status.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');
export const statusClass = (status = 'pending') => `admin-status admin-status--${status}`;
