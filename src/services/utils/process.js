// Helper func to map return graphql
// all function depends on the shape of this data

const mapResultGraphql = ({ cursor, type, results, meta }) => {
  return {
    meta: meta,
    edges: results.map(n => {
      return {
        cursor: {
          id: Buffer.from(n[cursor].toString()).toString('base64'),
          type: type
        },
        node: n
      }
    })
  }
}

const objResultGraphql = ({ cursor, type, results, meta }) => {
  return {
    cursor: {
      id: Buffer.from(results[cursor].toString()).toString('base64'),
      type: type
    },
    node: results
  }
}

const fuzzySearch = (needle, haystack) => {
  let hlen = haystack.length
  let nlen = needle.length
  if (nlen > hlen) {
    return false
  }
  if (nlen === hlen) {
    return needle === haystack
  }

  outerLoop: for (var i = 0, j = 0; i < nlen; i++) {
    let nch = needle.charCodeAt(i)
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outerLoop
      }
    }
    return false
  }
  return true
}

const applySearch = (data, spec) => {
  const reducerFn = (acc, search) => {
    acc.edges = acc.edges.filter(n => {
      const fieldName = Object.keys(search.field)[0]

      if (search.method === 'exact') {
        return n.node[fieldName] === search.field[fieldName]
      }
      if (search.method === 'fuzzy') {
        return fuzzySearch(search.field[fieldName], n.node[fieldName])
      }
      if (search.method === 'none') {
        return true
      }
    })
    return acc
  }

  return spec.reduce(reducerFn, data)
}

const sortAlpha = (a, b) => {
  const strA = a.toString().toLowerCase().trim()
  const strB = b.toString().toLowerCase().trim()
  return strA === strB ? 0 : strA < strB ? -1 : 1
}
const sortNumber = (a, b) => {
  return a - b
}

const sortDate = (a, b) => {
  return new Date(b) - new Date(a)
}

const applyOrder = (data, spec) => {
  const reducerFn = (acc, order) => {
    acc.edges = acc.edges.sort((a, b) => {
      const fieldName = order.field

      if (order.method === 'string') {
        return sortAlpha(a.node[fieldName], b.node[fieldName])
      }
      if (order.method === 'int') {
        return sortNumber(a.node[fieldName], b.node[fieldName])
      }
      if (order.date === 'date') {
        return sortDate(a.node[fieldName], b.node[fieldName])
      }
    })
    if (order.direction === 'DESC') {
      acc.edges.reverse()
    }
    return acc
  }
  return spec.reduce(reducerFn, data)
}
const applySkip = (data, spec) => {
  data.edges = data.edges.slice(spec)
  return data
}
const applyTake = (data, spec) => {
  data.edges = data.edges.slice(0, spec)
  return data
}

const processDataResults = (results, { take, skip, order, search }) => {
  results = search ? applySearch(results, search) : results
  results = order ? applyOrder(results, order) : results
  results = skip ? applySkip(results, skip) : results
  results = take ? applyTake(results, take) : results
  return results
}

export {
  mapResultGraphql,
  objResultGraphql,
  fuzzySearch,
  applySearch,
  sortAlpha,
  sortNumber,
  applyOrder,
  applySkip,
  applyTake,
  processDataResults
}
