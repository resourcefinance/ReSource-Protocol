import { useCountUp } from "react-countup"
import { useCountUpProps } from "react-countup/build/useCountUp"
import { usePreviousDistinct } from "react-use"

interface useManagedCountUpProps extends useCountUpProps {
  ether?: boolean
  mwei?: boolean
}

export const useManagedCountUp = (props: useManagedCountUpProps) => {
  const { ether, mwei, ...rest } = props
  // const formattingFn = ether ? formatEther : mwei ? formatMwei : walletValueToString

  return useCountUp({
    start: usePreviousDistinct(props.end),
    separator: ",",
    decimals: 2,
    duration: 1,
    ...rest,
  })
}
