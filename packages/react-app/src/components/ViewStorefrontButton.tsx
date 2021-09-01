import { BoxProps, Button } from "@chakra-ui/react"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = { handle: string } & BoxProps
export const ViewStorefrontButton = ({ handle, ...rest }: Props) => {
  return (
    <Button
      as={"a"}
      variant="link"
      color="blue.main"
      target={"_blank"}
      rel="noopener noreferrer"
      href={`https://app.resourcenetwork.co/${handle}`}
      rightIcon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
    >
      View storefront
    </Button>
  )
}
