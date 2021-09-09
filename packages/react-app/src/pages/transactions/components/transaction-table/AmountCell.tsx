import { HStack } from "@chakra-ui/react"
import React from "react"
import { CellProps } from "react-table"
import { TransactionRowData } from "."
import GlyphLabel from "../../../../components/glyph/RusdGlyphLabel"
import { baseCellStyles, Header, TransactionColumn } from "./foundations"

type AmountCellProps = CellProps<TransactionRowData, number>

const AmountCell = ({ row, cell }: AmountCellProps) => {
  const amount = cell.value
  const { type } = row.original.type
  const color = type === "purchase" || type === "sent" ? "black" : "green"

  return (
    <HStack {...baseCellStyles}>
      <GlyphLabel color={color} right={0} size="sm" value={amount} />
    </HStack>
  )
}

export const amountColumn: TransactionColumn = {
  Header: Header({ title: "amount" }),
  accessor: "amount",
  Cell: AmountCell,
}
