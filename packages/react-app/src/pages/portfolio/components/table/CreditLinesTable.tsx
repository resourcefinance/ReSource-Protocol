import { BoxProps } from "@chakra-ui/layout"
import { Box, TableColumnHeaderProps, Tbody, Td } from "@chakra-ui/react"
import { Table, TableCellProps, TableRowProps, Th, Thead, Tr } from "@chakra-ui/table"
import React from "react"
import { useTable } from "react-table"
import { CreditLineFieldsFragment } from "../../../../generated/subgraph/graphql"
import { formatEther, formatMwei } from "../../../../services/web3/utils/etherUtils"
import { textStyles } from "../../../../theme/textStyles"
import { getArrayOfEmptyObjects } from "../../mocks/tableData"
import { tableDrawerWidth, tableHeaderHeight, tableRowHeight } from "./constants"
import { tableSchema } from "./tableSchema"

interface Props extends BoxProps {
  creditLines: CreditLineFieldsFragment[]
}

const CreditLinesTable = ({ creditLines, ...rest }: Props) => {
  const tableInstance = useGetTableInstance(creditLines)
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  return (
    <Box overflowX="auto" ml="200px" paddingLeft={tableDrawerWidth} {...rest} pl={0}>
      {/* apply the table props */}
      <Table w="full" minW="1100px" variant="striped" {...getTableProps()}>
        <Thead h={tableHeaderHeight}>
          {// Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {// Loop over the headers in each row
              headerGroup.headers.map((column) => (
                // Apply the header cell props
                <Th
                  {...column.getHeaderProps()}
                  {...defaultColumnHeaderProps}
                  {...(textStyles.body as any)}
                  minW="120px"
                >
                  {// Render the header
                  column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        {/* Apply the table body props */}
        <Tbody {...getTableBodyProps()}>
          {// Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row)
            return (
              // Apply the row props
              <Tr {...row.getRowProps()} {...defaultRowProps}>
                {// Loop over the rows cells
                row.cells.map((cell) => {
                  // Apply the cell props
                  return (
                    <Td
                      {...cell.getCellProps()}
                      {...defaultCellProps}
                      {...(textStyles.number as any)}
                    >
                      {// Render the cell contents
                      cell.render("Cell")}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}

const useGetTableInstance = (creditLines: CreditLineFieldsFragment[]) => {
  const data = React.useMemo(
    () => [...creditLines.map(dataFormatter), ...backfill(creditLines)],
    [],
  ) as any
  const columns = React.useMemo(() => tableSchema, [])

  return useTable({ columns, data })
}

const dataFormatter = (creditLine: CreditLineFieldsFragment) => {
  return {
    ...creditLine,
    balance: { value: creditLine.balance, label: "rUSD" },
    totalReward: { value: creditLine.totalReward, label: "MU" },
    outstandingReward: { value: creditLine.outstandingReward, label: "MU" },
    creditLimit: { value: formatMwei(creditLine.creditLimit), label: "rUSD" },
    collateral: { value: formatEther(creditLine.collateral), label: "MU" },
    actions: true,
  }
}

// this function returns a bunch of "empty" credit lines so that table is filled with
// rows that maintain alternating background colors
function backfill(creditLines: CreditLineFieldsFragment[]) {
  return getArrayOfEmptyObjects(29)
}

const defaultCellProps: TableCellProps = {
  py: "inherit",
  px: "4px",
  isNumeric: true,
}

const defaultRowProps: TableRowProps = {
  h: tableRowHeight,
}

const defaultColumnHeaderProps: TableColumnHeaderProps = {
  py: "inherit",
  px: "4px",
  h: tableHeaderHeight,
  textTransform: "initial",
  isNumeric: true,
  color: "gray.700",
  letterSpacing: "normal",
}

export default CreditLinesTable
