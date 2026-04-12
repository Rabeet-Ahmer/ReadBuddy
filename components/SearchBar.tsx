"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="search-bar">
      <Search className="search-bar-icon" />
      <input
        type="text"
        placeholder="Search by title or author..."
        defaultValue={query}
        onChange={handleChange}
        className="search-bar-input"
      />
    </div>
  );
};

export default SearchBar;
