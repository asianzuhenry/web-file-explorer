import { useState, useEffect } from "react";
import Folder from "./Folder";
import FileModel from "./FileModel";

type FileItem = {
  name: string;
  isDirectory: boolean;
};

export default function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pathStack, setPathStack] = useState<string[]>([""]); // track nested paths
  const [filecontent, setFilecontent] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = pathStack.join("/");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/files?path=${currentPath}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setFiles(data.files ?? []);
      } catch (err) {
        console.error(err);
        setFiles([]);
      }
    };
    fetchFiles();
  }, [currentPath]);

  const openFolder = (folderName: string) => { 
    setPathStack(prev => [...prev, folderName]);
  };

// ...existing code...
const readFile = async (fileName: string) => {
  const basePath = pathStack.join("/");
  const fullPath = basePath
    ? `/home/henry/${basePath}/${fileName}`
    : `/home/henry/${fileName}`;
  console.log("Reading file:", fullPath);

  try {
    const res = await fetch(`http://localhost:3000/api/file?filePath=${fullPath}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    console.log("File content:", data.content);
    setFilecontent(data.content);
    setIsOpen(true);
  } catch (err) {
    console.error(err);
  }
};
// ...existing code...
  const goBack = () => {
    setPathStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <div>
      <button className="text-white hover:cursor-pointer hover:scale-105 px-4 py-2 m-3 rounded-2xl  bg-blue-700" onClick={goBack} disabled={pathStack.length === 1}>
        Back
      </button>
      <hr />
      <div className="w-full flex flex-wrap justify-center">
        {files.map(file => (
          <Folder
            key={file.name}
            name={file.name}
            isDirectory={file.isDirectory}
            setSearch={openFolder} // click folder to go deeper
            readFile={readFile}
          />
        ))}
        {isOpen && (
          <div className="w-full p-4 m-3 border rounded-lg shadow-md z-10 bg-white fixed top-20 left-1/2 transform -translate-x-1/2 max-w-3xl max-h-[80vh] overflow-auto">
            <FileModel name="File Content" content={filecontent} pathStack={pathStack} setIsOpen={setIsOpen} />
          </div>
        )}
      </div>
    </div>
    );
}
