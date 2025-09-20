const Header = () => {
  return (
    <header className="bg-gray-200 text-back p-4 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">File Explorer</h1>
        <p className="text-sm">Browse and manage your files and directories</p>
      </div>
      <div>
        <input className="p-3 bg-gray-300 rounded-2xl" type="text" placeholder="search directory or file"/>
      </div>
    </header>
  );
};

export default Header;
