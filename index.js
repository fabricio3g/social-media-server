const { ApolloServer } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const mongoose = require('mongoose')

const pubSub = new PubSub()

const resolvers = require('./graphql/resolvers/index')

const PORT = proces.env.PORT || 5000

const { MONOGURI } = require('./config.js')
const typeDefs = require('./graphql/typeDefs')


const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({req, pubSub})
})

mongoose.connect(MONOGURI, {useNewUrlParser:true})
	.then(()=> {
		console.log('Mongo connected')
		return server.listen({port: PORT})
	})
	.then( res =>{
		console.log('Server running at port: ' + res.url)
	})

