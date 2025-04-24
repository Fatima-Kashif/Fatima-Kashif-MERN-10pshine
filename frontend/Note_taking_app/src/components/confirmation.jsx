const Confirmation = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'blue'
  }) => {
    if (!isOpen) return null;
  
    const colorClasses = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      red: 'bg-red-500 hover:bg-red-600',
      orange: 'bg-orange-500 hover:bg-orange-600'
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-medium mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg ${colorClasses[confirmColor]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Confirmation;