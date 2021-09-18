const Query = {
    livros(parent, args, ctx, info){
        return ctx.db.livros
    },
    pessoas(parent, args, ctx, info){
        return ctx.db.pessoas
    },
    comentarios(parent, args, ctx, info){
        return ctx.db.comentarios
    }
}

export default Query