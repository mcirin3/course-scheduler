'use client';

import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  onSearch: (query: string) => void;
  small?: boolean;
};

export default function SearchBar({ onSearch, small = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <TextField
        size={small ? "small" : "medium"}
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        fullWidth
        InputProps={{
          sx: { backgroundColor: "white", borderRadius: 1 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
