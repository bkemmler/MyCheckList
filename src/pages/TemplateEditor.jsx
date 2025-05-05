import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, saveTemplate } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

function TemplateEditor() {
  const { id } = useParams(); // Get template ID from URL if editing
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [items, setItems] = useState([]); // [{ id: string, text: string }]
  const [newItemText, setNewItemText] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const existingTemplate = getTemplateById(id);
      if (existingTemplate) {
        setTemplateName(existingTemplate.name);
        setItems(existingTemplate.items || []);
      } else {
        // Handle case where template ID is invalid (e.g., redirect or show error)
        console.error("Template not found for editing:", id);
        navigate('/templates'); // Redirect back to list
      }
    } else {
      // Reset for new template
      setTemplateName('');
      setItems([]);
    }
  }, [id, isEditing, navigate]);

  const handleAddItem = (e) => {
    e.preventDefault(); // Prevent form submission if wrapped in form
    if (newItemText.trim()) {
      setItems([...items, { id: uuidv4(), text: newItemText.trim() }]);
      setNewItemText(''); // Clear input after adding
    }
  };

  const handleItemChange = (itemId, newText) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, text: newText } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Bitte geben Sie einen Namen für die Vorlage ein.");
      return;
    }
    const templateData = {
      id: isEditing ? id : undefined, // Pass ID only if editing
      name: templateName.trim(),
      items: items,
    };
    saveTemplate(templateData);
    navigate('/templates'); // Go back to the list after saving
  };

  return (
    <div>
      <h2>{isEditing ? 'Vorlage bearbeiten' : 'Neue Vorlage erstellen'}</h2>

      <label htmlFor="templateName">Vorlagenname:</label>
      <input
        type="text"
        id="templateName"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Name der Vorlage"
        required
      />

      <h3>Einträge:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemChange(item.id, e.target.value)}
              style={{ flexGrow: 1, marginRight: '10px' }}
            />
            <button onClick={() => handleRemoveItem(item.id)} className="danger small">X</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem} style={{ display: 'flex', marginTop: '15px' }}>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Neuen Eintrag hinzufügen..."
          style={{ flexGrow: 1, marginRight: '10px' }}
        />
        <button type="submit">Hinzufügen</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave}>
          {isEditing ? 'Änderungen speichern' : 'Vorlage speichern'}
        </button>
        <button onClick={() => navigate('/templates')} className="secondary">
          Abbrechen
        </button>
      </div>
    </div>
  );
}

export default TemplateEditor;
