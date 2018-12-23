// Create a generic service tailored for mongoose model and custom graphql response

import {
  mapResultGraphql,
  objResultGraphql,
  processDataResults
} from './process'

const serviceFactory = ({ Model, cursor, type }) => {
  const svc = {}
  svc.find = ({ user, ...args }) => {
    console.log(user, args)
    const model = Model
    return model
      .find({ user })
      .then(results => {
        return mapResultGraphql({
          cursor: cursor,
          type: type,
          results
        })
      })
      .then(results => {
        return processDataResults(results, args || {})
      })
  }
  svc.create = ({ user, data }) => {
    const userWithData = { user, ...data }
    const model = new Model(userWithData)
    return model
      .save()
      .then(results => {
        return objResultGraphql({
          cursor: cursor,
          type: type,
          results
        })
      })
      .then(results => {
        return results
      })
  }
  svc.updateById = ({ id, user, data }) => {
    const userWithData = { user, ...data }
    const model = Model
    return model
      .findOneAndUpdate({ _id: id, user }, userWithData)
      .then(results => {
        return objResultGraphql({
          cursor: cursor,
          type: type,
          results
        })
      })
      .then(results => {
        return results
      })
  }
  return svc
}

export default serviceFactory
