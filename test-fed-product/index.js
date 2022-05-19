const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph')
const products = require('./products.json')

const port = 4001

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable", "@external"])

  type Product @key(fields: "id") {
    id: ID!
    title: String
    price: Float
    reviews: [Review]
  }
  extend type Review @key(fields: "id") {
    id: ID! @external
  }
  type Query {
    product(id: ID!): Product
    products: [Product]
  }
`


const resolvers = {
  Product: {
    reviews: async (product) => {
      return product.reviews.map(id =>{
        return {__typename: "Review", id }
      })
    }
  },
  Query: {
    product: (_, { id }, context, info) => {
      return products.find(product => product.id === id)
    },
    products: () => products
  }
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
})

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`)
})