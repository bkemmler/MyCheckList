import { v4 as uuidv4 } from 'uuid';

const TEMPLATES_KEY = 'checklistApp_templates';
const ACTIVE_KEY = 'checklistApp_active';
const ARCHIVED_KEY = 'checklistApp_archived';

// Helper to get data from localStorage
const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// Helper to save data to localStorage
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    // Handle potential storage full errors if necessary
  }
};

// --- Template Functions ---

export const getTemplates = () => getData(TEMPLATES_KEY);

export const getTemplateById = (id) => {
  const templates = getTemplates();
  return templates.find(template => template.id === id);
};

export const saveTemplate = (templateData) => {
  const templates = getTemplates();
  if (templateData.id) {
    // Update existing template
    const index = templates.findIndex(t => t.id === templateData.id);
    if (index > -1) {
      templates[index] = { ...templates[index], ...templateData };
    } else {
      // If ID provided but not found, treat as new (should ideally not happen with UUIDs)
      templates.push({ ...templateData, id: uuidv4() }); // Ensure ID if somehow missing
    }
  } else {
    // Create new template
    templates.push({ ...templateData, id: uuidv4(), items: templateData.items || [] });
  }
  saveData(TEMPLATES_KEY, templates);
  return templateData.id || templates[templates.length - 1].id; // Return the ID
};

export const deleteTemplate = (id) => {
  let templates = getTemplates();
  templates = templates.filter(template => template.id !== id);
  saveData(TEMPLATES_KEY, templates);
  // Consider deleting active/archived checklists based on this template?
  // For now, we leave them, they just won't be able to start new ones from this template.
};

// --- Active Checklist Functions ---

export const getActiveChecklists = () => getData(ACTIVE_KEY);

export const getActiveChecklistById = (id) => {
  const activeChecklists = getActiveChecklists();
  return activeChecklists.find(checklist => checklist.id === id);
};

export const startChecklistFromTemplate = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) {
    console.error("Template not found for starting checklist");
    return null;
  }

  const activeChecklists = getActiveChecklists();
  const newChecklist = {
    id: uuidv4(),
    templateId: template.id,
    name: `${template.name} (Instanz)`, // Or prompt user for a name?
    items: template.items.map(item => ({ ...item, done: false })), // Add 'done' status
    createdAt: Date.now(),
  };
  activeChecklists.push(newChecklist);
  saveData(ACTIVE_KEY, activeChecklists);
  return newChecklist.id; // Return the new checklist ID
};

export const saveActiveChecklist = (checklistData) => {
  const activeChecklists = getActiveChecklists();
  const index = activeChecklists.findIndex(c => c.id === checklistData.id);
  if (index > -1) {
    activeChecklists[index] = { ...activeChecklists[index], ...checklistData };
    saveData(ACTIVE_KEY, activeChecklists);

    // Check if completed and archive
    const allDone = activeChecklists[index].items.every(item => item.done);
    if (allDone) {
      archiveChecklist(activeChecklists[index].id);
    }
  } else {
    console.error("Trying to save non-existent active checklist:", checklistData.id);
  }
};

export const deleteActiveChecklist = (id) => {
  let activeChecklists = getActiveChecklists();
  activeChecklists = activeChecklists.filter(checklist => checklist.id !== id);
  saveData(ACTIVE_KEY, activeChecklists);
};

// --- Archived Checklist Functions ---

export const getArchivedChecklists = () => getData(ARCHIVED_KEY);

export const archiveChecklist = (activeChecklistId) => {
  const activeChecklist = getActiveChecklistById(activeChecklistId);
  if (!activeChecklist) return;

  const archivedChecklists = getArchivedChecklists();
  const alreadyArchived = archivedChecklists.some(c => c.id === activeChecklistId);

  if (!alreadyArchived) {
      const archivedChecklist = {
          ...activeChecklist,
          completedAt: Date.now(),
      };
      archivedChecklists.push(archivedChecklist);
      saveData(ARCHIVED_KEY, archivedChecklists);
  }

  // Remove from active list regardless of whether it was already archived (clean up)
  deleteActiveChecklist(activeChecklistId);
};

export const deleteArchivedChecklist = (id) => {
    let archivedChecklists = getArchivedChecklists();
    archivedChecklists = archivedChecklists.filter(checklist => checklist.id !== id);
    saveData(ARCHIVED_KEY, archivedChecklists);
};
