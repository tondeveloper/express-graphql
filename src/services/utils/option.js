// Mongoose default options when creating a document

const transform = (doc, ret, opts) => {
  // hide fields from srialization
  if (opts.hide) {
    opts.hide.forEach(prop => {
      delete ret[prop]
    })
  }

  // always expose _id as id
  // even if virtual id is not present
  if (ret.id || ret._id) {
    ret.id = ret.id || ret._id
  }

  delete ret._id

  return ret
}

const options = opts => {
  return {
    toObject: {
      virtuals: true,
      getters: true,
      transform: transform,
      hide: ['_v', '_id']
    },
    toJSON: {
      virtuals: true,
      getters: true,
      transform: transform,
      hide: ['_v', '_id']
    },
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'modifiedDate'
    }
  }
}

export default options
