export default function Folder({
  name,
  isDirectory,
  setSearch,
}: {
  name: string;
  isDirectory: boolean;
  setSearch: (value: string) => void;
}) {
  return (
    <div
      className="bg-gray-100 p-4 w-52 m-3 hover:cursor-pointer hover:bg-gray-200 hover:scale-105 hover:transition rounded-lg shadow-md"
      onClick={() => isDirectory && setSearch(name)}
    >
      <img
        className="mb-2"
        src={isDirectory ? "/folder.png" : "/file.png"}
        alt={isDirectory ? "Folder Icon" : "File Icon"}
      />
      <h2 className="text-xl font-bold">{name}</h2>
      <span className="text-sm text-gray-500">
        {isDirectory ? "Directory" : "File"}
      </span>
    </div>
  );
}
