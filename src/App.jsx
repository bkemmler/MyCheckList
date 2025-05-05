import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Overview from './pages/Overview';
import TemplateList from './pages/TemplateList';
import TemplateEditor from './pages/TemplateEditor';
import ActiveChecklistList from './pages/ActiveChecklistList';
import ChecklistRunner from './pages/ChecklistRunner';
import ArchiveList from './pages/ArchiveList';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Checklisten App</h1>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/new" element={<TemplateEditor />} />
            <Route path="/templates/edit/:id" element={<TemplateEditor />} />
            <Route path="/active" element={<ActiveChecklistList />} />
            <Route path="/run/:id" element={<ChecklistRunner />} />
            <Route path="/archive" element={<ArchiveList />} />
            {/* Add a fallback route for unknown paths */}
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>

        <nav className="app-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Übersicht</NavLink>
          <NavLink to="/templates" className={({ isActive }) => isActive ? 'active' : ''}>Vorlagen</NavLink>
          <NavLink to="/active" className={({ isActive }) => isActive ? 'active' : ''}>Aktiv</NavLink>
          <NavLink to="/archive" className={({ isActive }) => isActive ? 'active' : ''}>Archiv</NavLink>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;
