const Livro = {
    autor (parent, args, ctx, info){
        return ctx.db.pessoas.find((pessoa) => pessoa.id === parent.autor)
        //console.log (`Parent: ${JSON.stringify(parent)}`)
    },
    comentarios (parent, args, ctx, info){
        return ctx.db.comentarios.filter (comentario => comentario.livro === parent.id)
    }
}

export default Livro