import React from 'react';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <p>{description || 'This section is being set up in the next phase.'}</p>
    </div>
  );
}
