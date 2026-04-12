"use client";

import { useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
          params.set("q", value.trim());
        } else {
          params.delete("q");
        }

        router.replace(`?${params.toString()}`);
      }, 300);
    },
    [router, searchParams],
  );

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
