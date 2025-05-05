import React from 'react';

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="overlay" onClick={onCancel}></div>
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div>
          <button onClick={onConfirm} className="danger">Bestätigen</button>
          <button onClick={onCancel} className="secondary">Abbrechen</button>
        </div>
      </div>
    </>
  );
}

export default ConfirmationDialog;
