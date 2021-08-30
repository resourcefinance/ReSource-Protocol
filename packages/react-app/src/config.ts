import dotenv from "dotenv"
dotenv.config()

export const isProd = process.env.NODE_ENV === "production"

export const config = {
  NODE_ENV: process.env.NODE_ENV!,
  SEGMENT: {
    SEGMENT_WRITE: isProd
      ? process.env.REACT_APP_SEGMENT_WRITE_DEV!
      : process.env.REACT_APP_SEGMENT_WRITE_DEV!,
  },
  GRAPHQL_URI: process.env.REACT_APP_GRAPHQL_URI!,
  REST: {
    UPLOAD: process.env.REACT_APP_REST_API_UPLOAD!,
    REMOTE: process.env.REACT_APP_REST_API_UPLOAD_REMOTE!,
    DELETE: process.env.REACT_APP_REST_API_UPLOAD_DELETE!,
    REFRESH_TOKEN: process.env.REACT_APP_REST_API_REFRESH_TOKEN!,
    DELETE_TOKEN: process.env.REACT_APP_REST_API_DELETE_TOKEN!,
  },
  CUSTOMER_IO: {
    CIO_API_KEY: process.env.REACT_APP_CIO_API_KEY!,
    CIO_SITE_ID: process.env.REACT_APP_CIO_SITE_ID!,
    CIO_APP_API_KEY: process.env.REACT_APP_CIO_APP_API_KEY!,
  },
  SENTRY: {
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN!,
  },
  UNSPLASH: {
    ACCESS_KEY: process.env.REACT_APP_UNSPLASH_ACCESS_KEY!,
  },
  STREAM: { STREAM_KEY: process.env.REACT_APP_STREAM_KEY! },
  AWS: {
    KEY_STORE_APIGW: "https://vv3cigcx96.execute-api.us-east-2.amazonaws.com/",
  },
  BLOCKCHAIN: {
    NETWORK: process.env.REACT_APP_BLOCKCHAIN_NETWORK!,
    RUSD_TOKEN_ADDRESS: process.env.REACT_APP_RUSD_TOKEN_ADDRESS!,
    MU_TOKEN_ADDRESS: process.env.REACT_APP_MU_TOKEN_ADDRESS!,
    EXPLORER: process.env.REACT_APP_BLOCKCHAIN_EXPLORER!,
  },
  GUARDIAN: {
    REGISTER: process.env.REACT_APP_GUARDIAN_REGISTER!,
    RESET: process.env.REACT_APP_GUARDIAN_RESET!,
    RECOVER: process.env.REACT_APP_GUARDIAN_RECOVER!,
    UPDATE: process.env.REACT_APP_GUARDIAN_UPDATE!,
  },
}

export default config
