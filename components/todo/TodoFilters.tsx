import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoFiltersProps {
  readonly searchTerm: string;
  readonly setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  readonly table: any;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  table,
}) => {
  const filterValue = table.getColumn("completed")?.getFilterValue();

  let selectedValue: string;
  if (filterValue === true) {
    selectedValue = "completed";
  } else if (filterValue === false) {
    selectedValue = "pending";
  } else {
    selectedValue = "all";
  }

  return (
    <>
      {/* Search Input */}
      <Input
        placeholder="Search and filter by title..."
        value={searchTerm}
        onChange={(event) => {
          const value = event.target.value;
          setSearchTerm(value);
          table.getColumn("title")?.setFilterValue(value);
        }}
        className="w-full max-w-xs md:w-[180px]"
      />

      {/* Status Filter Dropdown */}
      <Select
        value={selectedValue}
        onValueChange={(value) => {
          const isCompleted = value === "completed";
          const filterValue = value === "all" ? undefined : isCompleted;
          table.getColumn("completed")?.setFilterValue(filterValue);
        }}
      >
        <SelectTrigger className="w-full max-w-xs md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
