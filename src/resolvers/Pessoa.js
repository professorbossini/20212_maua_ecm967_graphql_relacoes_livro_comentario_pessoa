const Pessoa = {
    livros (parent, args, ctx, info){
        return ctx.db.livros.filter(livro => livro.autor === parent.id)
    },
    comentarios (parent, args, ctx, info){
        console.log(JSON.stringify(parent))
        return ctx.db.comentarios.filter(comentario => comentario.autor === parent.id)
    }
}

export default Pessoa