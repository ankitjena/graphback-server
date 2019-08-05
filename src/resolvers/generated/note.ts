import { GraphQLContext } from '../../context'

enum Subscriptions {
  NEW_NOTE = 'newnote'
}

export const noteResolvers = {
  Note: {
    comments: (parent: any, _: any, context: GraphQLContext) => {
      return context.db.select().from('comment').where('noteId', '=', parent.id)
    }
  },

  Query: {
    findNotes: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('note').where(args.fields)
    },
    findAllNotes: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('note')
    }
  },

  Mutation: {
    createNote: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await context.db('note').insert(args.input).returning('id')
      const result = await context.db.select().from('note').where('id', '=', id)
      context.pubsub.publish(Subscriptions.NEW_NOTE, {
        newNote: result[0]
      })
      return result[0]
    },
    updateNote: (_: any, args: any, context: GraphQLContext) => {
      return context.db('note').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('note').where('id', '=' , args.id);
        return result[0]
    })},
    deleteNote: (_: any, args: any, context: GraphQLContext) => {
      return context.db('note').where('id', '=' , args.id).del().then( () => {
        return args.id;
    })}
  },

  Subscription: {
    newNote: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.NEW_NOTE)
      }
    }
  }
}
