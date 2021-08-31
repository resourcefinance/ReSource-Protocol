import ReactPagination from "react-js-pagination"
import React from "react"
import { Box, BoxProps } from "@chakra-ui/react"

interface PaginationProps extends BoxProps {
  pageSize: number
  total: number
  current: number
  handleChange: (page: number) => void
}

const Pagination = ({ current, pageSize, total, handleChange, ...rest }: PaginationProps) => {
  return (
    <Box visibility={total <= pageSize ? "hidden" : "visible"} {...rest}>
      <ReactPagination
        activePage={current}
        itemsCountPerPage={pageSize}
        totalItemsCount={total}
        pageRangeDisplayed={5}
        onChange={handleChange}
        hideDisabled={true}
      />
    </Box>
  )
}

export default Pagination
