import { Box, BoxProps } from "@chakra-ui/layout"
import { Center, HStack } from "@chakra-ui/react"
import { useHistory } from "react-router-dom"
import { useRecoilValue } from "recoil"
import GlyphLabel from "../components/glyph/GlyphLabel"

const pillContainerStyles: BoxProps = {
  bgColor: "white",
  borderRadius: "2xl",
  border: "1px solid",
  py: 1,
  px: 2,
}

const WalletInfo = ({ ...rest }: BoxProps) => {
  const history = useHistory()
  // const { id, wallet } = useGetMe().myBusiness
  return (
    <Box {...rest} cursor="pointer" onClick={() => history.push("/wallet")}>
      <HStack spacing={-10}>
        <Center {...pillContainerStyles} left={0} borderColor="gray.700">
          <GlyphLabel
            loading={false}
            lineHeight="0"
            mx={2}
            pr={10}
            size="sm"
            variant="balance"
            value={0}
          />
        </Center>
        <Center {...pillContainerStyles} right={0} borderColor="primary.dark">
          <GlyphLabel
            loading={false}
            lineHeight="0"
            mx={2}
            size="sm"
            variant="gradient"
            value={0}
          />
        </Center>
      </HStack>
    </Box>
  )
}

export default WalletInfo
