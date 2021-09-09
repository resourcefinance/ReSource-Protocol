import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputProps,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { caption, body } from "../theme/textStyles"

const validStyles: InputProps = {
  borderColor: "black",
}

interface FormFieldProps {
  formikKey: string
  formik: any
  title?: string
  description?: string
  children: React.ReactElement<InputProps>
}

const FormikField = (props: FormFieldProps) => {
  const { formikKey: key, formik, title, description, children: formElement } = props
  const externalProps = formElement.props
  const internalProps = {
    name: key,
    value: formik.values[key] || "",
    onChange: formik.handleChange,
    isInvalid: !!formik.errors[key],
    errorMessage: formik.errors[key],
  }

  const hasNonDefaultValue = key === "cost" ? internalProps.value !== "0" : !!internalProps.value
  const additionalStyles = hasNonDefaultValue ? validStyles : {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { errorMessage, isInvalid, ...forwardedInternalProps } = internalProps
  const formElementProps = { ...forwardedInternalProps, ...externalProps, ...additionalStyles }

  return (
    <FormControl id={key} isInvalid={internalProps.isInvalid}>
      <HStack justifyContent="space-between">
        <FormLabel {...body} mb={1} ml={3} mr={1}>
          {title}
        </FormLabel>
        <FormErrorMessage {...caption} flex={2} mb={0} textAlign="left" justifySelf="start">
          *{internalProps.errorMessage}
        </FormErrorMessage>
      </HStack>
      {React.cloneElement(formElement, formElementProps)}
      <Text variant="caption" color="gray.500" w="full" textAlign="right" mt={2} pr={2}>
        {description}
      </Text>
    </FormControl>
  )
}

export default FormikField
