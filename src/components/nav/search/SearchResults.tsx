import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RefObject } from "react";

export type SearchResult = {
  id: string;
  title: string;
  url: string;
  category?: string;
};

interface SearchResultsProps {
  searchResultsRef: RefObject<HTMLDivElement>;
  showResults: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  handleSelect: (url: string) => void;
}

export const SearchResults = ({
  searchResultsRef,
  showResults,
  searchQuery,
  searchResults,
  handleSelect
}: SearchResultsProps) => {
  if (!showResults || !searchQuery) return null;

  return (
    <div 
      ref={searchResultsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1c1c1e] rounded-md shadow-lg border border-gray-200 dark:border-[#232325] overflow-hidden z-[41] transition-transform duration-300 origin-top"
    >
      <Command className="border-none bg-transparent">
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup>
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.url)}
                  className={cn(
                    "cursor-pointer flex items-center justify-between py-2",
                    "hover:bg-[#f3f4f6] dark:hover:bg-[#2d2d2d]",
                    "data-[selected=true]:bg-[#f3f4f6] dark:data-[selected=true]:bg-[#2d2d2d]",
                    "transition-colors duration-200"
                  )}
                >
                  <span className="font-medium text-[#000000] dark:text-[#FFFFFF]">
                    {result.title}
                  </span>
                  {result.category && (
                    <span className="text-xs text-[#000000A6] dark:text-[#FFFFFFA6]">
                      {result.category}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};