const Subscription = {
    dado: {
        subscribe (parent, args, ctx, info){
            setInterval(() => {
                ctx.pubSub.publish ('dado', {
                    dado: Math.floor(Math.random() * 6) + 1
                })
            }, 2000)
            return ctx.pubSub.asyncIterator('dado')
        }
    },
    comentario: {
        subscribe (parent, args, ctx, info){
            const livro = ctx.db.livros.find( l => l.id === args.idLivro)
            if (!livro)
                throw new Error ("Livro não existe")
            return ctx.pubSub.asyncIterator(`comentario ${args.idLivro}`)
        }
    }
}

export default Subscription