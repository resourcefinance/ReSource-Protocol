import { BoxProps, chakra, Table as ReactTable, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import { Column, useFlexLayout, useSortBy, useTable } from "react-table"
import { useRecoilValue } from "recoil"
import { transactionOrderBySelector } from "../store/transaction"

const rowStyles: BoxProps = {
  borderRadius: "16px",
  my: 2,
  px: 2,
  _hover: {
    bgColor: "gray.100",
    cursor: "pointer",
  },
}

const cellStyles: BoxProps = {
  p: 2,
  border: "none",
  display: "flex",
  alignItems: "end",
  justifyContent: "flex-end",
  alignSelf: "center",
}

export interface OnOrderByProps {
  id: string
  isSorted: boolean
  isSortedDesc?: boolean
}

interface TableProps {
  columns: Column[]
  data: any
  onRowClick?: (id: string) => void
  onOrderBy?: (props: OnOrderByProps) => void
  showHeader?: boolean
}

const Table = ({ columns, data, onRowClick, onOrderBy, showHeader }: TableProps) => {
  const orderBy = useRecoilValue(transactionOrderBySelector)
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useFlexLayout,
  )

  const Header = ({ column }: any) => {
    const { id } = column

    const handleSortClick = () => {
      if (column.disableSortBy) return
      column.toggleSortBy(orderBy[id] === "asc")
      // allows react table to update variables before executing callback
      setTimeout(() => {
        const { id, isSorted, isSortedDesc } = column
        onOrderBy?.({ id, isSorted, isSortedDesc })
      })
    }

    return (
      <Th
        {...column.getHeaderProps(column.getSortByToggleProps())}
        _first={{ justifyContent: "flex-start" }}
        {...cellStyles}
        isNumeric={column.isNumeric}
        onClick={handleSortClick}
      >
        {orderBy[column.id] && (
          <chakra.span pr={2}>
            <FontAwesomeIcon
              size="sm"
              icon={orderBy[column.id] === "asc" ? faAngleDown : faAngleUp}
            />
          </chakra.span>
        )}
        {column.render("Header")}
      </Th>
    )
  }

  const Row = ({ row }: any) => {
    return (
      <Tr {...row.getRowProps()} {...rowStyles} onClick={() => onRowClick?.(row.original.id)}>
        {row.cells.map((cell: any) => {
          return (
            <Td
              key={cell.column.id}
              {...cell.getCellProps()}
              {...cellStyles}
              isNumeric={cell.column.isNumeric}
              _first={{ justifyContent: "flex-start" }}
            >
              {cell.render("Cell")}
            </Td>
          )
        })}
      </Tr>
    )
  }

  return (
    <ReactTable {...getTableProps()}>
      <Thead display={showHeader ? "" : "none"}>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()} px={2}>
            {headerGroup.headers.map((column: any) => (
              <Header key={column.id} column={column} />
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row)
          return <Row key={row.id} row={row} />
        })}
      </Tbody>
    </ReactTable>
  )
}

export default Table
