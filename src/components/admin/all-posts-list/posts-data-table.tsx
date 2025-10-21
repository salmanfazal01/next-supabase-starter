"use client";

import DashboardContentCard from "@/components/dashboard/dashboard-content-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUpdatePostStatus } from "@/hooks/supabase/use-posts";
import type { PostStatusType, PostWithDetails } from "@/types/database/posts";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { createColumns } from "./columns";

interface PostsDataTableProps {
  data: PostWithDetails[];
  page: number;
  pageSize: number;
  totalPosts: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PostsDataTable({
  data,
  page,
  pageSize,
  totalPosts,
  onPageChange,
  onPageSizeChange,
}: PostsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { mutateAsync: updateStatus } = useUpdatePostStatus();

  const handleChangeStatus = async (postId: string, status: PostStatusType) => {
    await updateStatus({ postId, status });
  };

  const columns = createColumns(handleChangeStatus);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    manualPagination: true,
    pageCount: Math.ceil(totalPosts / pageSize),
  });

  const handleSearch = (value: string) => {
    table.getColumn("caption")?.setFilterValue(value);
  };

  // Pagination
  const totalPages = Math.ceil(totalPosts / pageSize);
  const currentPage = page + 1;
  const canGoPrevious = page > 0;
  const canGoNext = page < totalPages - 1;

  // Search
  const searchValue =
    (table.getColumn("caption")?.getFilterValue() as string) ?? "";

  // Table rows
  const rows = table.getRowModel().rows;
  const hasRows = rows?.length > 0;

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* SEARCH BAR */}
        <DashboardContentCard>
          <div className="flex items-center justify-between gap-4">
            {/* Search Input */}
            <Input
              placeholder="Search by caption..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />

            {/* Total Count */}
            <div className="text-muted-foreground text-sm">
              {totalPosts} {totalPosts === 1 ? "post" : "posts"} total
            </div>
          </div>
        </DashboardContentCard>

        {/* DATA TABLE */}
        <DashboardContentCard>
          <Table>
            {/* Table Header */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {hasRows ? (
                // Render data rows
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Empty state
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DashboardContentCard>

        {/* PAGINATION CONTROLS */}
        <DashboardContentCard>
          <div className="flex items-center justify-between">
            {/* Left Side: Page Info & Per-Page Selector */}
            <div className="flex items-center gap-4">
              {/* Current Page Info */}
              <div className="text-muted-foreground text-sm">
                Page {currentPage} of {totalPages}
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Items per page:
                </span>

                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    onPageSizeChange(Number(value));
                    onPageChange(0); // Reset to first page
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Side: Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={!canGoPrevious}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          </div>
        </DashboardContentCard>
      </div>
    </TooltipProvider>
  );
}
