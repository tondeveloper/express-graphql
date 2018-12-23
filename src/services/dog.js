import mongoose from 'mongoose'

import serviceFactory from './utils/factory'
import options from './utils/option'

const Schema = new mongoose.Schema(
  {
    user: { type: String, index: true },
    name: { type: String },
    type: { type: String },
    color: { type: String },
    sock: { type: String, enum: ['ankle', 'crew', 'knee', 'thigh'] }
  },
  options
)

const Service = connection => {
  const model = connection.model('Dog', Schema)
  const svc = serviceFactory({ Model: model, cursor: 'id', type: 'dog' })
  return svc
}

export { Schema }
export default Service
