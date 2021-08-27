const Menu = {
  parts: ["item", "list", "button", "divider"],
  baseStyle: {
    item: {
      fontWeight: "medium",
      lineHeight: "normal",
      color: "gray.600",
      justifyContent: "space-between",
      rounded: "2xl",
    },
    divider: {
      mx: 3,
    },
    list: {
      rounded: "2xl",
      boxShadow: "md",
    },
    button: {
      rounded: "2xl",
      border: "1px solid",
      borderColor: "gray.300",
      _hover: {
        boxShadow: "sm",
      },
    },
  },
  sizes: {
    sm: {
      button: {
        fontSize: "0.75rem",
        px: 2,
        py: 1,
      },
      item: {
        fontSize: "0.75rem",
        px: 2,
        py: 1,
      },
    },
    md: {
      button: {
        fontSize: "0.75rem",
        px: 3,
        py: 2,
      },
      item: {
        fontSize: "0.875rem",
        px: 3,
        py: 2,
      },
    },
  },
  defaultProps: {
    size: "md",
  },
}

export default Menu
