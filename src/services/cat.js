import mongoose from 'mongoose'

import serviceFactory from './utils/factory'
import options from './utils/option'

const Schema = new mongoose.Schema(
  {
    user: { type: String, index: true },
    name: { type: String },
    type: { type: String },
    color: { type: String },
    hat: { type: String, enum: ['tophat', 'cap', 'beanie', 'fedora'] }
  },
  options
)

const Service = connection => {
  const model = connection.model('Cat', Schema)
  const svc = serviceFactory({ Model: model, cursor: 'id', type: 'cat' })
  return svc
}

export { Schema }
export default Service
