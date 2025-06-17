import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit2, Save } from "lucide-react";

interface Note {
  id: string;
  text: string;
  editing: boolean;
}

const StickyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stickyNotes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([
      { id: Date.now().toString(), text: newNote, editing: false },
      ...notes,
    ]);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const startEdit = (id: string) => {
    setNotes(notes.map((n) => n.id === id ? { ...n, editing: true } : n));
  };

  const saveEdit = (id: string, text: string) => {
    setNotes(notes.map((n) => n.id === id ? { ...n, text, editing: false } : n));
  };

  return (
    <ToolLayout
      title="📈 Sticky Notes"
      description="Create and manage quick notes."
    >
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex gap-2">
          <Textarea
            placeholder="Write a new note..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            className="min-h-[48px]"
          />
          <Button onClick={addNote} className="h-fit px-3 py-2" title="Add Note">
            <Plus />
          </Button>
        </div>
        <div className="grid gap-4">
          {notes.length === 0 && (
            <div className="text-center text-muted-foreground">No notes yet.</div>
          )}
          {notes.map(note => (
            <div key={note.id} className="bg-yellow-100 dark:bg-yellow-300/10 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 flex items-start gap-3 relative">
              {note.editing ? (
                <div className="flex-1">
                  <Textarea
                    value={note.text}
                    onChange={e => saveEdit(note.id, e.target.value)}
                    className="min-h-[48px]"
                  />
                  <Button size="sm" className="mt-2" onClick={() => saveEdit(note.id, note.text)}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex-1 whitespace-pre-line">{note.text}</div>
              )}
              <div className="flex flex-col gap-2 ml-2">
                {!note.editing && (
                  <Button size="icon" variant="ghost" onClick={() => startEdit(note.id)} title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => deleteNote(note.id)} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
};

export default StickyNotes;
