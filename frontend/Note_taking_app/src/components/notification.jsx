const Notification = ({ message, type, onClose }) => {
    const bgColor = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800'
    }[type];
  
    return (
      <div className={`${bgColor} px-4 py-2 rounded-lg shadow-lg mb-2 flex justify-between items-center animate-fade-in`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg">
          &times;
        </button>
      </div>
    );
  };
  
  export default Notification;