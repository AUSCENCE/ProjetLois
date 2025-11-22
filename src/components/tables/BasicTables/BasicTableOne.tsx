import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import React from "react";
import Button from "../../ui/button/Button";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { BoxCubeIcon, BoxIcon, EyeIcon, InfoIcon, TrashBinIcon } from "../../../icons";

// Define a generic Column interface
interface Column<T> {
  header: string;
  accessorKey?: keyof T; // Make accessorKey optional for action columns
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  isActionColumn?: boolean; // New flag to identify action columns
  onEdit?: (row: T) => void; // Optional edit function for action column
  onDelete?: (row: T) => void; // Optional delete function for action column
  onModify?: (row: T) => void; // Optional modify function for action column
}

// Define the props for the generic BasicTableOne component
interface BasicTableOneProps<T> {
  columns: Column<T>[];
  data: T[];
  // Optional default action handlers for a dedicated action column
  defaultOnEdit?: (row: T) => void;
  defaultOnDelete?: (row: T) => void;
  defaultOnModify?: (row: T) => void;
}

export default function BasicTableOne<T>({
  columns,
  data,
  defaultOnEdit,
  defaultOnDelete,
  defaultOnModify,
}: BasicTableOneProps<T>) {
  // Create a default action column if any default action handlers are provided
  const defaultActionColumn: Column<T> | null =
    defaultOnEdit || defaultOnDelete || defaultOnModify
      ? {
        header: "Actions",
        isActionColumn: true,
        onEdit: defaultOnEdit,
        onDelete: defaultOnDelete,
        onModify: defaultOnModify,
        className: "text-center", // Center align buttons in the default action column
        headerClassName: "px-5 py-3 font-medium text-gray-500 text-theme-sm dark:text-gray-400 text-center", // Center align header for the default action column
      }
      : null;

  // Combine user-defined columns with the default action column if it exists
  const finalColumns = defaultActionColumn
    ? [...columns, defaultActionColumn]
    : columns;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {finalColumns.map((column, index) => (
                <TableCell
                  key={column.accessorKey as string || column.header || index}
                  isHeader
                  className={
                    column.headerClassName ||
                    "px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  }
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {finalColumns.map((column, colIndex) => (
                    <TableCell
                      key={column.accessorKey as string || column.header || colIndex}
                      className={
                        column.className ||
                        "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                      }
                    >
                      {column.isActionColumn ? (
                        <div className="flex items-center justify-center gap-2">
                          {column.onEdit && (
                            <Button
                              size="sm"
                              variant="primary"
                              startIcon={<FaEye className="size-3" />}
                              onClick={() => column.onEdit?.(row)}
                              className="hover:bg-blue-400 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >

                            </Button>
                          )}
                          {column.onModify && (
                            <Button
                              size="sm"
                              variant="danger"
                              startIcon={<FaEdit className="size-3" />}
                              onClick={() => column.onModify?.(row)}
                              className=" bg-yellow-600  hover:bg-yellow-500  text-white hover:text-yellow-800  dark:text-yellow-400 dark:hover:text-yellow-300"
                            >

                            </Button>
                          )}
                          {column.onDelete && (
                            <Button
                              size="sm"
                              variant="danger"
                              startIcon={<FaTrash className="size-3" />}
                              onClick={() => column.onDelete?.(row)}
                              className="bg-red-600 text-white hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-300"
                            >
                            </Button>
                          )}
                        </div>
                      ) : (
                        column.cell ? column.cell(row) : (column.accessorKey ? (row[column.accessorKey] as React.ReactNode) : null)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="px-5 py-3 text-center text-gray-500">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
