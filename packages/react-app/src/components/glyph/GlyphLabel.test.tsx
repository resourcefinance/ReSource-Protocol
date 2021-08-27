import { render } from "@testing-library/react"
import colors from "../../theme/foundations/colors"
import GlyphLabel from "./GlyphLabel"

beforeEach(() => {
  jest.resetModules()
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("Glyph", () => {
  it("should render without failing", async () => {
    render(<GlyphLabel />)
  })

  describe("correct decimal and comma handling", () => {
    it("should render 0.00 by default", async () => {
      const { getByText } = render(<GlyphLabel />)
      expect(getByText(/0.00/)).toBeInTheDocument()
    })

    it("should render 2 decimals with input 'float' value", () => {
      const { getByText } = render(<GlyphLabel value={2.1} />)
      expect(getByText(/2.10/)).toBeInTheDocument()
    })

    it("should render 2 decimals with input 'float' value", () => {
      const { getByText } = render(<GlyphLabel value={2.12} />)
      expect(getByText(/2.12/)).toBeInTheDocument()
    })

    it("should render 2 decimals with input int value", () => {
      const { getByText } = render(<GlyphLabel value={2} />)
      expect(getByText(/2.00/)).toBeInTheDocument()
    })

    it("should render 2 decimals with input string value", () => {
      const { getByText } = render(<GlyphLabel value="2.00" />)
      expect(getByText(/2.00/)).toBeInTheDocument()
    })

    it("should render 2 decimals with input string value", () => {
      const { getByText } = render(<GlyphLabel value="2" />)
      expect(getByText(/2.00/)).toBeInTheDocument()
    })

    it("should render appropriate commas on large values", () => {
      const { getByText } = render(<GlyphLabel value={2000000} />)
      expect(getByText(/2,000,000.00/)).toBeInTheDocument()
    })

    it("should render appropriate commas on large values", () => {
      const { getByText } = render(<GlyphLabel value={2000000.5} />)
      expect(getByText(/2,000,000.50/)).toBeInTheDocument()
    })

    it("should throw an error when string input cannot be parsed", () => {
      const temp = console.error
      console.error = jest.fn()
      const renderGlyph = () => render(<GlyphLabel value="bad input" />)
      expect(renderGlyph).toThrow()
      console.error = temp
    })
  })

  describe("correct color handling for variants and values", () => {
    it("should render black by default", () => {
      const { getByTestId } = render(<GlyphLabel value={1.5} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.gray.main)
    })

    it("should render green for positive balance", async () => {
      const { getByTestId } = render(<GlyphLabel variant="balance" value={1.5} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.green.main)
    })

    it("should render black for zero balance", async () => {
      const { getByTestId } = render(<GlyphLabel variant="balance" value={0} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.black.main)
    })

    it("should render black for negative balance", async () => {
      const { getByTestId } = render(<GlyphLabel variant="balance" value={-0.5} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.black.main)
    })

    it("should render red for negative balance with bad standing", async () => {
      const { getByTestId } = render(
        <GlyphLabel variant="balance" badStanding={true} value={-0.5} />,
      )
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.red.main)
    })

    it("should render gray for price variant", async () => {
      const { getByTestId } = render(<GlyphLabel variant="price" value={1.5} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.gray.main)
    })

    it("should render purple for credit variant", async () => {
      const { getByTestId } = render(<GlyphLabel variant="credit" value={1.5} />)
      expect(getByTestId("glyph-icon-bg")).toHaveAttribute("fill", colors.purple.main)
    })
  })
})
