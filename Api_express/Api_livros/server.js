
import "dotenv/config" ;
import express, {application, response} from "express";
import mysql from "mysql2";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'Sen@iDev77!.',
    database:'livraria', 
    port: 3306
})

conn.connect((err)=>{
    if(err){
        return console.error(err.stack);
    };
    
    console.log("MySql Conectado");

    app.listen(PORT, ()=>{
        console.log('servidor na port', PORT);
    });
});


app.get("/livros", (request, response)=>{
    //query para banco de dados(consulta)
    const sql = /*sql*/`SELECT * FROM livros`;

    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({message:'Erro ao buscar livros'});
            return console.log(err);
        };

        const livros = data;
        response.status(200).json(livros);
    });
});

app.get("/funcionario", (request, response) => {
    const sql = `SELECT * FROM Funcionarios`

    conn.query(sql, (err, data) => {
        if(err) {
            response.status(500).json({message: 'Erro ao buscar livros'})
            return console.log(err)
        }
        const funcionario = data
        response.status(200).json(livros)
    })
})

app.post('/funcionarios', (request, response) => {
    const {nome, cpf, idade, salario, email} = request.body
    if(!nome){
        response.status(400).json({message: 'Campo obrigatório'});
        return
    }
    if(!cpf){
        response.status(400).json({message: 'Campo obrigatório'});
        return
    }
    if(!idade){
        response.status(400).json({message: 'Campo obrigatório'});
        return
    }
    if(!salario){
        response.status(400).json({message: 'Campo obrigatório'});
        return
    }
    if(email = undefined){
        response.status(400).json({message: 'Campo obrigatório'});
        return
    }

 const checksql = 
`SELECT * FROM Funcionarios 
 WHERE nome= "${nome}" AND
 cpf = "${cpf}" AND
 idade = "${idade}" AND
 salario = "${salario}" AND
 email = "${email}"`

 conn.query(checksql, (err, data)=>{
    if(err){
        response.status(500).json({message:'Erro ao buscar livros'});
        return console.log(err);
    };

    if(data.length > 0){
        response.status(409).json({message:"Esse funcionario já existe na livraria"});
        return console.log(err);
    }

    const id = uuidv4()
    const disponibilidade = 1

    const insertSql = /*sql*/`INSERT INTO Funcionario(nome, cpf, idade, salario, email)
    VALUES("${nome}", "${cpf}", "${idade}", "${salario}", "${email}")`

    conn.query(insertSql, (err) =>{
        if(err){
            response.status(500).json({message:'Erro ao cadastar funconario'});
            return console.log(err);
        };

        response.status(201).json({message:'Funcionario cadastrado'})
    })

});

})

app.post('/livros', (request, response)=>{
    const {titulo, autor, ano_publicacao, genero, preco} = request.body;

    //validacoes
    if(!titulo){
        response.status(400).json({message: 'Campo obrigatório'});
        return 
    } else if(!autor){
        response.status(400).json({message: 'Campo obrigatório'});
        return 
    } else if(!ano_publicacao){
        response.status(400).json({message: 'Campo obrigatório'});
        return 
    } else if(!genero){
        response.status(400).json({message: 'Campo obrigatório'});
        return 
    } else if(!preco){
        response.status(400).json({message: 'Campo obrigatório'});
        return 
    };
// Logo abaixo viria o FS.
//Cadastrar um livro -> antes preciso saber se este livro existe
    const checksql = /*sql*/ `
    SELECT * FROM livros 
    WHERE titulo = "${titulo}" AND 
    autor = "${autor}" AND 
    ano_publicacao = "${ano_publicacao}"`;

    conn.query(checksql, (err, data)=>{
        if(err){
            response.status(500).json({message:'Erro ao buscar livros'});
            return console.log(err);
        };

        if(data.length > 0){
            response.status(409).json({message:"Esse livro já existe na livraria"});
            return console.log(err);
        }

        const id = uuidv4()
        const disponibilidade = 1

        const insertSql = /*sql*/`INSERT INTO livros(id, titulo, autor, ano_publicacao, genero, preco, disponibilidade)
        VALUES("${id}", "${titulo}", "${autor}", "${ano_publicacao}", "${genero}","${preco}","${disponibilidade}")`

        conn.query(insertSql, (err) =>{
            if(err){
                response.status(500).json({message:'Erro ao cadastar livro'});
                return console.log(err);
            };

            response.status(201).json({message:'Livro cadastrado'})
        })

    });
});

// Listar um livro 
app.get('/livros/:id', (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/ `
    SELECT * FROM livros WHERE id = "${id}"`
    
    conn.query(sql, (err, data)=>{
        if(err){
          console.error(err)
          response.status(500).json({message: "Erro ao buscar os Dados."})
          return
        }

        if(data.length === 0){
            response.status(404).json({message: "Livro não encontrado."})
        }a

        response.status(200).json(data)

    })
})
//Listar um funcionario
app.get('/funcoinario/:id', (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/ `
    SELECT * FROM funcionarios WHERE id = "${id}"`
    
    conn.query(sql, (err, data)=>{
        if(err){
          console.error(err)
          response.status(500).json({message: "Erro ao buscar os Dados."})
          return
        }

        if(data.length === 0){
            response.status(404).json({message: "Funcionario não encontrado."})
        }a

        response.status(200).json(data)

    })
})


app.put('/livros/:id', (request, response)=>{
    const {id} = request.params
})
app.delete('/livros/:id', (request, response)=>{
    const {id} = request.params
})
app.use((request, response)=>{
    response.status(404).json({message:"Não encontrado"});
});