const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph')
const reviews = require('./reviews.json')
const port = 4002

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable", "@external"])

  type Review @key(fields: "id") {
    id: ID!
    content: String
  }

  type Query {
    review(id: ID!): Review
    reviews: [Review]
  }
`


const resolvers = {
  Review: {
    __resolveReference: (object) => {
      return reviews.find(review => review.id === object.id)
    }
  },
  Query: {
    review: (_, { id }, context, info) => {
      return reviews.find(review => review.id === id)
    },
    reviews: () => reviews
  }
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
})

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`)
})