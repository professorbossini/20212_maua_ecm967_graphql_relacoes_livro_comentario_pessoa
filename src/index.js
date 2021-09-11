import {
    GraphQLServer
} from 'graphql-yoga'

import { v4 as uuidv4 } from 'uuid'

let pessoas = [
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

let livros = [
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

let comentarios = [
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
        inserirPessoa (pessoa: InserirPessoaInput):Pessoa!
        removerPessoa(id: ID!): Pessoa!
        inserirLivro (livro: InserirLivroInput): Livro!        
        inserirComentario(comentario: InserirComentarioInput): Comentario!
    }

    input InserirComentarioInput {
        texto: String!
        nota: Int!
        livro: ID!
        autor: ID!
    }

    input InserirPessoaInput {
        nome: String!
        idade: Int
    }

    input InserirLivroInput {
        titulo: String!
        edicao: Int!
        autor: ID!
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
                nome: args.pessoa.nome,
                idade: args.pessoa.idade
            }
            pessoas.push(pessoa)
            return pessoa
        },
        removerPessoa (parent, args, ctx, info){
            const indice = pessoas.findIndex(p => p.id === args.id)
            if (indice < 0)
                throw new Error ("Pessoa não existe")
                //splice operar in-place
            const removido = pessoas.splice(indice, 1)[0]
            livros = livros.filter (livro => {
                const remover = livro.autor === args.id
                comentarios = comentarios.filter(c => remover && c.livro !== livro.id)
                return !remover
            })
            comentarios = comentarios.filter(c => c.autor !== args.id)
            return removido
            
        },
        inserirLivro (parent, args, ctx, info){
            const autorExiste = pessoas.some (p => p.id === args.livro.autor)
            if (!autorExiste)
                throw new Error ("Autor não existe")
            const livro = {
                id: uuidv4(),
                titulo: args.livro.titulo,
                edicao: args.livro.edicao,
                autor: args.livro.autor
            }
            livros.push(livro)
            return livro
        },
        inserirComentario (parent, args, ctx, info){
            const pessoaExiste = pessoas.some(p => p.id === args.comentario.autor)
            const livroExiste = livros.some(l => l.id === args.comentario.livro)
            if (!pessoaExiste || !livroExiste)
                throw new Error ("Autor e/ou Livro inexistente(s)")
            const comentario = {
                id: uuidv4(),
                texto: args.comentario.texto,
                nota: args.comentario.nota,
                livro: args.comentario.livro,
                autor: args.comentario.autor
            }
            comentarios.push(comentario)
            return comentario
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