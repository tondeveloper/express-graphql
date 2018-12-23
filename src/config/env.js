import dotenv from 'dotenv'
dotenv.config()

const env = {
  MONGO_URL_1: process.env.MONGO_URL_1,
  MONGO_URL_2: process.env.MONGO_URL_2
}

const get = name => {
  const v = env[name]
  if (v === undefined) {
    console.log(`ERROR - No env found for [${name}]`)
  }
  return v
}

export default {
  get
}
