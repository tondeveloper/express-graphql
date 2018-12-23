const addUserContext = (context, args) => {
  return { user: context.user, ...args }
}

const PetQuery = ({ services }) => (root, args, context, info) => {
  return {
    Dog: {
      find: args => services.Dog.find(addUserContext(context, args))
    },
    Cat: {
      find: args => services.Cat.find(addUserContext(context, args))
    }
  }
}

const PetMutation = ({ services }) => (root, rootArgs, context, info) => {
  return {
    Dog: {
      create: args => services.Dog.create(addUserContext(context, args)),
      update: args => services.Dog.updateById(addUserContext(context, args))
    },
    Cat: {
      create: args => services.Cat.create(addUserContext(context, args)),
      update: args => services.Cat.updateById(addUserContext(context, args))
    }
  }
}

const resolver = dependancies => {
  const GraphQL = {
    Query: {
      Pets: PetQuery(dependancies)
    },
    Mutation: {
      Pets: PetMutation(dependancies)
    }
  }

  return GraphQL
}

export default resolver
