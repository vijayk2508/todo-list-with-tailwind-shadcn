import * as React from "react";
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly handlePageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  handlePageChange,
}) => (
  <TableFooter>
    <TableRow>
      <TableCell colSpan={columns.length}>
        <div className="flex flex-col md:flex-row items-center justify-between md:justify-end space-y-4 md:space-y-0 md:space-x-4 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="w-full md:w-auto"
          >
            Previous
          </Button>
          <span className="text-center md:text-left">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="w-full md:w-auto"
          >
            Next
          </Button>
        </div>
      </TableCell>
    </TableRow>
  </TableFooter>
);
