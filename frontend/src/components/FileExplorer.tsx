import { useState, useEffect } from "react";
import Folder from "./Folder";

type FileItem = {
  name: string;
  isDirectory: boolean;
};

export default function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pathStack, setPathStack] = useState<string[]>([""]); // track nested paths

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

  const goBack = () => {
    setPathStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
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
          />
        ))}
      </div>
    </div>
  );
}
