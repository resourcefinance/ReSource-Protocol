import { Business } from "../../../generated/resource-network/graphql"
import { CreditLineFieldsFragment } from "../../../generated/subgraph/graphql"
import { localizedDayJs } from "../../../utils/dayjs"

const now = new Date()

export const mockBusiness: Business = {
  id: "123",
  handle: "",
  ownerId: "",
  kmsTaxId: "",
  name: "Business name",
  logoUrl: "logourl.com",
  wallet: { id: "", multiSigAddress: "", isActive: true, businessId: "123" },
}

export const mockCreditLine: CreditLineFieldsFragment & { actions: any } = {
  id: "test",
  active: true,
  underwritee: "0xa1b2c3d4",
  balance: 123.45,
  creditLimit: 234.56,
  collateral: 10000.12,
  outstandingReward: 1000000.5,
  totalReward: 10000,
  networkToken: "0xa1b2c3d4",
  issueDate: localizedDayJs(now).format("L"),
  actions: true,
}

export const getMockBusinesses = () => {
  return [...[...Array(15)].map(() => mockBusiness), ...getArrayOfEmptyObjects(12)] as Business[]
}

export const getMockCreditLines = () => {
  return [
    ...[...Array(15)].map(() => mockCreditLine),
    ...getArrayOfEmptyObjects(12),
  ] as CreditLineFieldsFragment[]
}

export const getArrayOfEmptyObjects = (count: number) => [...Array(count)].map(() => ({}))
