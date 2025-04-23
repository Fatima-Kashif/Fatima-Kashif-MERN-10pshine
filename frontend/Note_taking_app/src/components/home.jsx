const Home = () => {
    const notes = [
      { title: "Weekly meeting", content: "Notes from the weekly meeting" },
      { title: "Shopping list", content: "List of groceries and items" },
      { title: "Book notes", content: "Review notes from book" },
      { title: "Daily tasks", content: "To-do for the day" },
    ];
  
    return (
      <div className="min-h-screen bg-orange-50 flex">
        <aside className="w-64 bg-white p-6 border-r">
          <h2 className="text-2xl font-bold mb-6">NOTESF</h2>
          <button className="w-full mb-4 bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600">+ New note</button>
          <nav>
            <ul className="space-y-2 text-gray-700">
              <li>All notes</li>
              <li>Favorites</li>
              <li>Trash</li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6">Welcome back</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note, idx) => (
              <div key={idx} className="bg-white shadow rounded-xl p-4 hover:bg-orange-100">
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="text-sm text-gray-600">{note.content}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };

export default Home;