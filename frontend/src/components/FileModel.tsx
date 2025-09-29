import { useState } from "react";

const FileModel = ({
  name,
  content,
  pathStack,
  setIsOpen,
}: {
  name: string;
  content: string;
  pathStack: string[];
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const saveChanges = () => {
    // Logic to save changes
    console.log("Saved content:", editedContent);
    const updateFile = async () => {
      const basePath = pathStack.join("/");
      const fullPath = basePath ? `${basePath}/${name}` : name;
      console.log("Updating file:", fullPath);

      try {
        const res = await fetch(`http://localhost:3000/api/file`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath: fullPath, content: editedContent }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      }
    };
    updateFile();
    // setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 border rounded h-96"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap">
          {content || "Double-click a file to view its content."}
        </pre>
      )}
    </div>
  );
};
export default FileModel;
