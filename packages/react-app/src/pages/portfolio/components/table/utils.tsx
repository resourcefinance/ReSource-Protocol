import { useWindowSize } from "react-use"
import { footerHeight } from "../../../../components/Footer"
import { headerHeight } from "../../../../components/Header"
import { getArrayOfEmptyObjects } from "../../mocks/tableData"
import { portfolioHeaderHeight } from "../PortfolioHeader"

export const tableRowHeight = 45
export const tableHeaderHeight = 45
export const tableDrawerWidth = 300
export const tableStripeColor = "rgba(242, 242, 242, 0.5)"

export const useCalcMinRows = () => {
  const { height: windowHeight } = useWindowSize()
  const viewableTableHeight = windowHeight - headerHeight - footerHeight - portfolioHeaderHeight
  const minRows = Math.floor(viewableTableHeight / tableRowHeight) ?? 0
  return minRows
}

// this function returns a bunch of empty data so that table is filled with
// rows that maintain alternating background colors
export function useBackfillRows(data: any[]): any[] {
  const minRows = useCalcMinRows()
  if (data.length >= minRows) return []
  return getArrayOfEmptyObjects(minRows - data.length + 2) // add two rows as a buffer
}

export const useShouldScroll = (tableData: any[]) => {
  const minRows = useCalcMinRows()
  const isScrolledPastTop = (document.getElementById("tableContainer")?.scrollTop ?? 0) > 0
  return tableData.length > minRows || isScrolledPastTop
}
