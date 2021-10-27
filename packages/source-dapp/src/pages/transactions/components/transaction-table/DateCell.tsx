import { HStack, Text } from "@chakra-ui/react"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import { localizedDayJs } from "../../../../utils/dayjs"
import { baseCellStyles, Header, TransactionColumn } from "./foundations"

type DateCellProps = CellProps<TransactionRowData, string>

const DateCell = ({ cell }: DateCellProps) => {
  const date = cell.value
  const formattedDate = localizedDayJs(date).format("MMMM d, YYYY")

  return (
    <HStack {...baseCellStyles}>
      <Text noOfLines={1} textAlign="right" letterSpacing={1.5} color="gray.700">
        {formattedDate}
      </Text>
    </HStack>
  )
}

export const dateColumn: TransactionColumn = {
  Header: Header({ title: "date" }),
  accessor: "createdAt",
  Cell: DateCell,
}
