import {
    GraphQLServer
} from 'graphql-yoga'

// import { v4 as uuidv4 } from 'uuid'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Pessoa from './resolvers/Pessoa'
import Livro from './resolvers/Livro'
import Comentario from './resolvers/Comentario'

const resolvers = {
    Query,
    Mutation,
    Livro,
    Pessoa,
    Comentario 
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', 
    resolvers,
    context: {
        db
    }
})

server.start({
    port: 4200
}, () => console.log ('Servidor em execução'))