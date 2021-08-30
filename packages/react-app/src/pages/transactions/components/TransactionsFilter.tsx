import { Box, BoxProps, Center } from "@chakra-ui/layout"
import { Button, Spinner, Wrap } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  transactionFilterGroup,
  transactionFilterSelector,
  transactionQuerySelector,
  TransactionType,
} from "../../../store/transaction"
import { transactionTypeIconMap } from "./transaction-table/foundations"

interface Props extends BoxProps {
  isLoading: boolean
  variant?: "orders" | "transactions"
}

const TransactionsFilter = ({ variant = "transactions", isLoading, ...rest }: Props) => {
  const [filterTypes] = useState(transactionFilterGroup[variant])
  const [selectedFilters, setSelectedFilters] = useRecoilState(transactionFilterSelector)
  const setPagination = useSetRecoilState(transactionQuerySelector)

  const toggleFilter = (type: TransactionType) => {
    if (type === "all") return setSelectedFilters(["all"])

    if (selectedFilters.includes(type)) {
      setSelectedFilters(selectedFilters.filter((t) => t !== type && t !== "all"))
    } else {
      setSelectedFilters([...selectedFilters, type].filter((t) => t !== "all"))
    }
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const isToggled = (type: TransactionType) => {
    return selectedFilters.includes(type)
  }

  return (
    <Wrap>
      {filterTypes?.map((type) => {
        return (
          <Box key={type} px={1}>
            <Button
              variant="chip"
              colorScheme="primary"
              isActive={isToggled(type)}
              onClick={() => toggleFilter(type)}
              leftIcon={<FontAwesomeIcon icon={transactionTypeIconMap[type]} />}
            >
              {type}
            </Button>
          </Box>
        )
      })}

      {isLoading && (
        <Center px={3}>
          <Spinner color="primary.main" />
        </Center>
      )}
    </Wrap>
  )
}

export default TransactionsFilter
