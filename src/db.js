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

export default {pessoas, comentarios, livros}

