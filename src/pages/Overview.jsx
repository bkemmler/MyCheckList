import React from 'react';
import { Link } from 'react-router-dom';
import { getTemplates, getActiveChecklists, getArchivedChecklists } from '../utils/storage';

function Overview() {
  // You could potentially load counts here for display
  const templateCount = getTemplates().length;
  const activeCount = getActiveChecklists().length;
  const archivedCount = getArchivedChecklists().length;

  return (
    <div>
      <h2>Übersicht</h2>
      <p>Willkommen bei Ihrer Checklisten-App.</p>
      <ul>
        <li>
          <Link to="/templates">Vorlagen verwalten</Link> ({templateCount})
        </li>
        <li>
          <Link to="/active">Aktive Checklisten</Link> ({activeCount})
        </li>
        <li>
          <Link to="/archive">Archivierte Checklisten</Link> ({archivedCount})
        </li>
      </ul>
      {/* Add more dashboard-like elements if needed */}
    </div>
  );
}

export default Overview;
