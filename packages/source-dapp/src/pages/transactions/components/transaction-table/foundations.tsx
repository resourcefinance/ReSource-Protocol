import { BoxProps, Text } from "@chakra-ui/react"
import {
  faHome,
  faShoppingBasket,
  faSignInAlt,
  faSignOutAlt,
  faTag,
} from "@fortawesome/free-solid-svg-icons"
import { Column, SortByFn } from "react-table"

// the following is a kludge for getting react table to work with typescript, and the sortType
// function that is declared in the docs:
// https://react-table.tanstack.com/docs/api/useSortBy#column-options
export type TransactionColumn = Column & {
  sortType?: SortByFn<any>
  disableSortBy?: boolean
}

interface HeaderProps {
  title: string
  textAlign?: "left" | "right" | "center"
}

export const Header = ({ title, textAlign = "right" }: HeaderProps) => {
  return (
    <Text variant="caption" textTransform="none" color="gray.main" textAlign={textAlign}>
      {title}
    </Text>
  )
}

export const baseCellStyles: BoxProps = {
  py: 2,
  justifyContent: "flex-end",
  alignItems: "center",
}

export const transactionTypeIconMap = {
  purchase: faShoppingBasket,
  purchases: faShoppingBasket,
  sale: faTag,
  sales: faTag,
  sent: faSignOutAlt,
  received: faSignInAlt,
  all: faHome,
}
