const Comentario = {
    livro (parent, args, ctx, info){
        return ctx.db.livros.find(livro => livro.id === parent.livro)
    },
    autor (parent, args, ctx, info){
        return ctx.db.pessoas.find(p => p.id === parent.autor)
    }
}

export default Comentario