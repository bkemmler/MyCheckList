import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveChecklists, deleteActiveChecklist, getTemplates, startChecklistFromTemplate } from '../utils/storage';
import ConfirmationDialog from '../components/ConfirmationDialog';

function ActiveChecklistList() {
  const [activeChecklists, setActiveChecklists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For starting new checklist
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveChecklists(getActiveChecklists());
    setTemplates(getTemplates()); // Load templates for starting new ones
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchTerm) {
      return []; // Don't show templates unless searching
    }
    return templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  const handleStartChecklist = (templateId) => {
    const newChecklistId = startChecklistFromTemplate(templateId);
    if (newChecklistId) {
      navigate(`/run/${newChecklistId}`);
    } else {
      alert("Fehler beim Starten der Checkliste.");
    }
  };

  const handleDeleteClick = (checklist) => {
    setChecklistToDelete(checklist);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (checklistToDelete) {
      deleteActiveChecklist(checklistToDelete.id);
      setActiveChecklists(getActiveChecklists()); // Refresh list
      setChecklistToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setChecklistToDelete(null);
    setShowConfirmDialog(false);
  };

  const getProgress = (checklist) => {
    const totalItems = checklist.items.length;
    if (totalItems === 0) return '0%';
    const doneItems = checklist.items.filter(item => item.done).length;
    const percentage = Math.round((doneItems / totalItems) * 100);
    return `${percentage}% (${doneItems}/${totalItems})`;
  };

  return (
    <div>
      <h2>Aktive Checklisten</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Neue Checkliste starten (Vorlage suchen)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <ul>
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <li key={template.id} onClick={() => handleStartChecklist(template.id)} style={{ cursor: 'pointer' }}>
                  <span>{template.name}</span>
                  <button className="secondary small">Starten</button>
                </li>
              ))
            ) : (
              <li className="empty-state">Keine passende Vorlage gefunden.</li>
            )}
          </ul>
        )}
      </div>

      <h3>Laufende Checklisten:</h3>
      {activeChecklists.length === 0 ? (
        <p className="empty-state">Keine aktiven Checklisten vorhanden.</p>
      ) : (
        <ul>
          {activeChecklists.sort((a, b) => b.createdAt - a.createdAt).map(checklist => (
            <li key={checklist.id}>
              <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/run/${checklist.id}`)}>
                <strong>{checklist.name}</strong>
                <br />
                <small>Gestartet: {new Date(checklist.createdAt).toLocaleString()}</small>
                <br/>
                <small>Fortschritt: {getProgress(checklist)}</small>
              </div>
              <div className="list-item-actions">
                 <button onClick={() => navigate(`/run/${checklist.id}`)} className="secondary">Öffnen</button>
                 <button onClick={() => handleDeleteClick(checklist)} className="danger">Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showConfirmDialog && checklistToDelete && (
        <ConfirmationDialog
          message={`Möchten Sie die aktive Checkliste "${checklistToDelete.name}" wirklich löschen?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default ActiveChecklistList;
