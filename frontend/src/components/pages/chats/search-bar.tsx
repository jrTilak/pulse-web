import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
          <IoSearchOutline className="w-4 h-4 text-muted-foreground" />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          id="default-search"
          autoComplete="off"
          className="block w-full py-2 text-sm bg-gray-200 rounded-md outline-none text-muted-foreground p-x-4 ps-10"
          placeholder="Search users"
          required
        />
      </div>
    </form>
  );
};

export default SearchBar;