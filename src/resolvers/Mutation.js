
import {
    v4 as uuidv4
} from 'uuid'

const Mutation = {
    inserirPessoa (parent, args, ctx, info){
        const pessoa = {
            id: uuidv4(),
            nome: args.pessoa.nome,
            idade: args.pessoa.idade
        }
        ctx.db.pessoas.push(pessoa)
        return pessoa
    },
    removerPessoa (parent, args, ctx, info){
        const indice = ctx.db.pessoas.findIndex(p => p.id === args.id)
        if (indice < 0)
            throw new Error ("Pessoa não existe")
            //splice operar in-place
        const removido = ctx.db.pessoas.splice(indice, 1)[0]
        ctx.db.livros = ctx.db.livros.filter (livro => {
            const remover = livro.autor === args.id
            ctx.db.comentarios = ctx.db.comentarios.filter(c => remover && c.livro !== livro.id)
            return !remover
        })
        ctx.db.comentarios = ctx.db.comentarios.filter(c => c.autor !== args.id)
        return removido
        
    },
    atualizarPessoa (parent, args, {db} , info){
        const pessoa = db.pessoas.find(p => p.id === args.id)
        if (!pessoa)
            throw new Error ("Pessoa não existe")
        Object.assign(
            pessoa, 
            {
                nome: args.pessoa.nome || pessoa.nome,
                idade: args.pessoa.idade || pessoa.idade
            }
        )
        return pessoa
    },
    inserirLivro (parent, args, ctx, info){
        const autorExiste = ctx.db.pessoas.some (p => p.id === args.livro.autor)
        if (!autorExiste)
            throw new Error ("Autor não existe")
        const livro = {
            id: uuidv4(),
            titulo: args.livro.titulo,
            edicao: args.livro.edicao,
            autor: args.livro.autor
        }
        ctx.db.livros.push(livro)
        ctx.pubSub.publish('livro', {livro: {
            mutation: 'insercao',
            data: livro
        }})
        return livro
    },
    removerLivro (parent, args, ctx, info){
        const indice = ctx.db.livros.findIndex(livro => livro.id === args.id)
        if (indice < 0)
            throw new Error ("Livro não existe")
        const removido = ctx.db.livros.splice (indice, 1)[0]
        ctx.db.comentarios = ctx.db.comentarios.filter (c => c.livro !== args.id)
        ctx.pubSub.publish('livro', { livro: {
            mutation: 'remocao',
            data: removido
        }})
        return removido
    },
    atualizarLivro (parent, {id, livro}, ctx, info){
        const { db } = ctx
        const livroExistente = db.livros.find (l => l.id === id)
        if (!livroExistente)
            throw new Error ("Livro não existe")
        Object.assign(
            livroExistente,
            {
                titulo: livro.titulo || livroExistente.titulo,
                edicao: livro.edicao || livroExistente.edicao
            }
        )
    },
    inserirComentario (parent, args, ctx, info){
        const pessoaExiste = ctx.db.pessoas.some(p => p.id === args.comentario.autor)
        const livroExiste = ctx.db.livros.some(l => l.id === args.comentario.livro)
        if (!pessoaExiste || !livroExiste)
            throw new Error ("Autor e/ou Livro inexistente(s)")
        const comentario = {
            id: uuidv4(),
            texto: args.comentario.texto,
            nota: args.comentario.nota,
            livro: args.comentario.livro,
            autor: args.comentario.autor
        }
        ctx.db.comentarios.push(comentario)
        ctx.pubSub.publish (`comentario ${args.comentario.livro}`, {
            comentario: comentario
        })
        return comentario
    },
    removerComentario (parent, args, ctx, info){
        const indice = ctx.db.comentarios.findIndex(c => c.id === args.id)
        if (indice < 0)
            throw new Error ("Comentário não existe")
        return ctx.db.comentarios.splice (indice, 1)[0]
    },
    atualizarComentario (parent, { id, comentario }, { db }, info){
        const comentarioExistente = db.comentarios.find ( c => c.id === id)
        if (!comentarioExistente)
            throw new Error ("Comentario não existe")
        Object.assign(
            comentarioExistente,
            {
                texto: comentario.texto || comentarioExistente.texto,
                nota: comentario.nota || comentarioExistente.nota
            }
        )
        return comentarioExistente
    }
}

export default Mutation