import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filter: string | undefined;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<string | undefined>('all');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, filter, setFilter }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('Must be enclosed in <SearchProvider> for context.');
  }
  return context;
};
