import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTemplates, deleteTemplate } from '../utils/storage';
import ConfirmationDialog from '../components/ConfirmationDialog';

function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchTerm) {
      return templates;
    }
    return templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setTemplates(getTemplates()); // Refresh list
      setTemplateToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setTemplateToDelete(null);
    setShowConfirmDialog(false);
  };

  return (
    <div>
      <h2>Checklisten Vorlagen</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Vorlage suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Link to="/templates/new">
        <button>Neue Vorlage erstellen</button>
      </Link>

      {filteredTemplates.length === 0 ? (
         <p className="empty-state">{searchTerm ? 'Keine Vorlagen gefunden.' : 'Noch keine Vorlagen erstellt.'}</p>
      ) : (
        <ul>
          {filteredTemplates.map(template => (
            <li key={template.id}>
              <span>{template.name}</span>
              <div className="list-item-actions">
                 <button onClick={() => navigate(`/templates/edit/${template.id}`)} className="secondary">Bearbeiten</button>
                 <button onClick={() => handleDeleteClick(template)} className="danger">Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showConfirmDialog && templateToDelete && (
        <ConfirmationDialog
          message={`Möchten Sie die Vorlage "${templateToDelete.name}" wirklich löschen?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default TemplateList;
