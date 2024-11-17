'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface SearchParams {
  destination: string;
  category: string | null;
  guests: number;
  maxPrice: string;
  dateRange: DateRange[];
  searchTerm: string;
}

interface SearchContextProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  setSearchTerm: (term: string) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: "",
    category: null,
    guests: 1,
    maxPrice: "",
    dateRange: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ],
    searchTerm: "",
  });
  const [isSearchActive, setIsSearchActive] = useState(false);

  const setSearchTerm = (term: string) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      searchTerm: term,
    }));
  };

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        setSearchParams,
        isSearchActive,
        setIsSearchActive,
        setSearchTerm,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};