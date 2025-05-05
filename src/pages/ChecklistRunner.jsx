import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActiveChecklistById, saveActiveChecklist } from '../utils/storage';

function ChecklistRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedChecklist = getActiveChecklistById(id);
    if (loadedChecklist) {
      setChecklist(loadedChecklist);
    } else {
      // Handle checklist not found (maybe already archived or deleted)
      console.error("Active checklist not found:", id);
      navigate('/active'); // Redirect to active list
    }
    setLoading(false);
  }, [id, navigate]);

  // Use useCallback to prevent unnecessary re-renders if passed down
  const handleToggleItem = useCallback((itemId) => {
    setChecklist(prevChecklist => {
      if (!prevChecklist) return null;

      const updatedItems = prevChecklist.items.map(item =>
        item.id === itemId ? { ...item, done: !item.done } : item
      );

      const updatedChecklist = { ...prevChecklist, items: updatedItems };

      // Save changes immediately
      saveActiveChecklist(updatedChecklist);

      // Check if archiving happened (saveActiveChecklist handles this)
      // If all items are done, it will be moved to archive, and next load will fail.
      // We might want to navigate away immediately after the last item is checked.
      const allDone = updatedItems.every(item => item.done);
      if (allDone) {
          alert(`Checkliste "${updatedChecklist.name}" abgeschlossen und archiviert.`);
          navigate('/active'); // Navigate back after completion
      }


      return updatedChecklist;
    });
  }, [navigate]); // Add navigate dependency

  if (loading) {
    return <div>Lade Checkliste...</div>;
  }

  if (!checklist) {
    // This case should ideally be handled by the redirect in useEffect
    return <div>Checkliste nicht gefunden.</div>;
  }

  const openItems = checklist.items.filter(item => !item.done);
  const doneItems = checklist.items.filter(item => item.done);

  return (
    <div>
      <h2>{checklist.name}</h2>
      <small>Gestartet: {new Date(checklist.createdAt).toLocaleString()}</small>

      <h3>Offene Punkte ({openItems.length})</h3>
      {openItems.length === 0 ? (
        <p className="empty-state">Alle Punkte erledigt!</p>
      ) : (
        <ul>
          {openItems.map(item => (
            <li key={item.id} className="checklist-item" onClick={() => handleToggleItem(item.id)}>
              <input
                type="checkbox"
                checked={false}
                readOnly // Control state via li click
              />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}


      {doneItems.length > 0 && (
          <>
            <h3 style={{marginTop: '20px'}}>Erledigte Punkte ({doneItems.length})</h3>
            <ul>
              {doneItems.map(item => (
                <li key={item.id} className="checklist-item done" onClick={() => handleToggleItem(item.id)}>
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly // Control state via li click
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </>
      )}


      <button onClick={() => navigate('/active')} className="secondary" style={{ marginTop: '20px' }}>
        Zurück zur Übersicht
      </button>
    </div>
  );
}

export default ChecklistRunner;
