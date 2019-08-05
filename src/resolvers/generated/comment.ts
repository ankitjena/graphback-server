import { GraphQLContext } from '../../context'

enum Subscriptions {
  NEW_COMMENT = 'newcomment'
}

export const commentResolvers = {
  Query: {
    findComments: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('comment').where(args.fields)
    },
    findAllComments: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('comment')
    }
  },

  Mutation: {
    createComment: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await context.db('comment').insert(args.input).returning('id')
      const result = await context.db.select().from('comment').where('id', '=', id)
      context.pubsub.publish(Subscriptions.NEW_COMMENT, {
        newComment: result[0]
      })
      return result[0]
    },
    updateComment: (_: any, args: any, context: GraphQLContext) => {
      return context.db('comment').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('comment').where('id', '=' , args.id);
        return result[0]
    })},
    deleteComment: (_: any, args: any, context: GraphQLContext) => {
      return context.db('comment').where('id', '=' , args.id).del().then( () => {
        return args.id;
    })}
  },

  Subscription: {
    newComment: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.NEW_COMMENT)
      }
    }
  }
}
