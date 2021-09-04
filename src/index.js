import {
    GraphQLServer
} from 'graphql-yoga'

import { v4 as uuidv4 } from 'uuid'

const pessoas = [
    {
        id: "1",
        nome: "Cormen",
        idade: 19
    },
    {
        id: "2",
        nome: "Velleman",
        idade: 22
    }
]

const livros = [
    {
        id: '100',
        titulo: 'Introduction to Algorithms',
        edicao: 3,
        autor: '1'
    },
    {
        id: '101',
        titulo: 'How to Prove It',
        edicao: 2,
        autor: '2'
    }
]

const comentarios = [
    {
        id: '1001',
        texto: 'excelente',
        nota: 5,
        livro: '101',
        autor: '1'
    },
    {
        id: '1002',
        texto: 'Gostei muito',
        nota: 5,
        livro: '101',
        autor: '1'
    },
    {
        id: '1003',
        texto: 'Bacana',
        nota: 4,
        livro: '100',
        autor: '1'
    }
]

const typeDefs = `
    type Pessoa {
        id: ID!
        nome: String!
        idade: Int
        livros: [Livro!]!
        comentarios: [Comentario!]!
    }

    type Livro{
        id: ID!
        titulo: String!
        edicao: Int!
        autor: Pessoa!
        comentarios: [Comentario!]!
    }

    type Comentario {
        id: ID!
        texto: String!
        nota: Int!
        livro: Livro!
        autor: Pessoa!
    }

    type Query {
        livros: [Livro!]!
        pessoas: [Pessoa!]!
        comentarios: [Comentario!]!
    }

    type Mutation{
        inserirPessoa (nome: String!, idade: Int):Pessoa!
        inserirLivro (titulo: String!, edicao: Int!, autor: ID!): Livro!
    }

`

const resolvers = {
    Query: {
        livros(){
            return livros
        },
        pessoas(){
            return pessoas
        },
        comentarios(){
            return comentarios
        }
    },
    Mutation: {
        inserirPessoa (parent, args, ctx, info){
            const pessoa = {
                id: uuidv4(),
                nome: args.nome,
                idade: args.idade
            }
            pessoas.push(pessoa)
            return pessoa
        },
        inserirLivro (parent, args, ctx, info){
            const autorExiste = pessoas.some (p => p.id === args.autor)
            if (!autorExiste)
                throw new Error ("Autor não existe")
            const livro = {
                id: uuidv4(),
                titulo: args.titulo,
                edicao: args.edicao,
                autor: args.autor
            }
            livros.push(livro)
            return livro
        }
    },
    Livro: {
        autor (parent, args, ctx, info){
            return pessoas.find((pessoa) => pessoa.id === parent.autor)
            //console.log (`Parent: ${JSON.stringify(parent)}`)
        },
        comentarios (parent, args, ctx, info){
            return comentarios.filter (comentario => comentario.livro === parent.id)
        }
    },
    Pessoa: {
        livros (parent, args, ctx, info){
            return livros.filter(livro => livro.autor === parent.id)
        },
        comentarios (parent, args, ctx, info){
            console.log(JSON.stringify(parent))
            return comentarios.filter(comentario => comentario.autor === parent.id)
        }
    },
    Comentario: {
        livro (parent, args, ctx, info){
            return livros.find(livro => livro.id === parent.livro)
        },
        autor (parent, args, ctx, info){
            return pessoas.find(p => p.id === parent.autor)
        }
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start({
    port: 4200
}, () => console.log ('Servidor em execução'))