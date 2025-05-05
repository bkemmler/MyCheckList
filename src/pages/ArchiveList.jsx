import React, { useState, useEffect, useMemo } from 'react';
import { getArchivedChecklists, deleteArchivedChecklist } from '../utils/storage';
import ConfirmationDialog from '../components/ConfirmationDialog'; // Assuming you have this component

function ArchiveList() {
  const [archivedChecklists, setArchivedChecklists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);

  useEffect(() => {
    setArchivedChecklists(getArchivedChecklists());
  }, []);

  const filteredArchivedChecklists = useMemo(() => {
    if (!searchTerm) {
      return archivedChecklists;
    }
    return archivedChecklists.filter(checklist =>
      checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.items.some(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [archivedChecklists, searchTerm]);

  const handleDeleteClick = (checklist) => {
    setChecklistToDelete(checklist);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (checklistToDelete) {
      deleteArchivedChecklist(checklistToDelete.id);
      setArchivedChecklists(getArchivedChecklists()); // Refresh list
      setChecklistToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setChecklistToDelete(null);
    setShowConfirmDialog(false);
  };

  return (
    <div>
      <h2>Archivierte Checklisten</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Archiv durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredArchivedChecklists.length === 0 ? (
        <p className="empty-state">{searchTerm ? 'Keine archivierten Checklisten gefunden.' : 'Das Archiv ist leer.'}</p>
      ) : (
        <ul>
          {filteredArchivedChecklists.sort((a, b) => b.completedAt - a.completedAt).map(checklist => (
            <li key={checklist.id}>
              <details style={{ flexGrow: 1 }}>
                  <summary>
                      <strong>{checklist.name}</strong>
                      <br />
                      <small>Abgeschlossen: {new Date(checklist.completedAt).toLocaleString()}</small>
                      <br/>
                      <small>Gestartet: {new Date(checklist.createdAt).toLocaleString()}</small>
                  </summary>
                  <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                      {checklist.items.map(item => (
                          <li key={item.id} style={{fontSize: '0.9em', border: 'none', padding: '2px 0'}}>
                              <span style={{textDecoration: 'line-through', color: '#555'}}>{item.text}</span>
                          </li>
                      ))}
                  </ul>
              </details>
              <div className="list-item-actions">
                 <button onClick={() => handleDeleteClick(checklist)} className="danger small">Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showConfirmDialog && checklistToDelete && (
        <ConfirmationDialog
          message={`Möchten Sie die archivierte Checkliste "${checklistToDelete.name}" wirklich löschen?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default ArchiveList;
