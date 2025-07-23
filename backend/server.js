// backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// --- Configuração do Banco de Dados MySQL ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456', // <--- SUBSTITUA PELA SUA SENHA DO MYSQL!
    database: 'db_technovision'
};

let connection;

async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conectado ao banco de dados MySQL.');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err.message);
        setTimeout(connectToDatabase, 5000);
    }
}

connectToDatabase();

// --- Configuração de Middlewares ---
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// body-parser.json() é para requisições JSON. Para PUT com FormData, Multer cuidará.
// No entanto, se você tiver outras rotas PUT/PATCH que só enviam JSON, mantenha-o.
// Para esta rota PUT com Multer, o Multer processará o body.
app.use(bodyParser.json());

const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));

app.use(async (req, res, next) => {
    if (!connection || connection.state === 'disconnected') {
        console.warn('Conexão com o banco de dados perdida. Tentando reconectar...');
        await connectToDatabase();
        if (!connection || connection.state === 'disconnected') {
            return res.status(500).json({ message: 'Erro: Conexão com o banco de dados não estabelecida.' });
        }
    }
    next();
});


// --- Definir Endpoints da API ---

app.get('/', (req, res) => {
    res.send('Servidor backend está funcionando!');
});

app.options('/items', cors());
app.options('/items/:id', cors());

// Endpoint para cadastrar um novo item (POST /items)
app.post('/items', upload.single('image'), async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !quantity || !category) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar arquivo não utilizado:', err);
            });
        }
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const [result] = await connection.execute(
            `INSERT INTO items (nome, descricao, preco, quantidade, categoria, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, price, quantity, category, imageUrl]
        );
        res.status(201).json({
            message: 'Item cadastrado com sucesso!',
            id: result.insertId,
            item: { name, description, price, quantity, category, imageUrl }
        });
    } catch (err) {
        console.error('Erro ao inserir item no banco de dados MySQL:', err.message);
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar arquivo após falha no DB:', err);
            });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao cadastrar item.' });
    }
});

// Endpoint para listar todos os itens (GET /items)
app.get('/items', async (req, res) => {
    try {
        const [rows] = await connection.execute(`SELECT * FROM items ORDER BY id DESC`);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar itens do banco de dados MySQL:', err.message);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar itens.' });
    }
});

// Endpoint para atualizar um item (PUT /items/:id)
// AGORA USA upload.single('image') para lidar com a nova imagem
app.put('/items/:id', upload.single('image'), async (req, res) => {
    const itemId = req.params.id;
    // req.body agora contém os campos do formulário (name, description, etc.)
    const { name, description, price, quantity, category } = req.body;
    let newImageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl; // Nova imagem ou URL existente

    // Validação básica
    if (!name || !price || !quantity || !category) {
        // Se houver um novo arquivo, mas a validação falhar, remova-o
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar novo arquivo não utilizado:', err);
            });
        }
        return res.status(400).json({ message: 'Campos obrigatórios faltando para atualização.' });
    }

    try {
        // 1. Buscar a URL da imagem antiga antes de atualizar
        const [oldItemRows] = await connection.execute(`SELECT image_url FROM items WHERE id = ?`, [itemId]);
        const oldImageUrl = oldItemRows[0] ? oldItemRows[0].image_url : null;

        // 2. Atualizar o item no banco de dados
        const [result] = await connection.execute(
            `UPDATE items SET nome = ?, descricao = ?, preco = ?, quantidade = ?, categoria = ?, image_url = ? WHERE id = ?`,
            [name, description, price, quantity, category, newImageUrl, itemId]
        );

        if (result.affectedRows === 0) {
            // Se o item não foi encontrado, e um novo arquivo foi enviado, remova o novo arquivo
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Erro ao deletar novo arquivo para item não encontrado:', err);
                });
            }
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        // 3. Se uma NOVA imagem foi enviada E havia uma imagem antiga, exclua a imagem antiga do disco
        if (req.file && oldImageUrl && oldImageUrl.startsWith('/uploads/')) {
            const oldImagePath = path.join(uploadDir, path.basename(oldImageUrl));
            fs.unlink(oldImagePath, (err) => {
                if (err) console.warn('Aviso: Não foi possível deletar a imagem antiga:', oldImagePath, err.message);
            });
        }

        res.status(200).json({ message: 'Item atualizado com sucesso!', id: itemId, item: { name, description, price, quantity, category, imageUrl: newImageUrl } });
    } catch (err) {
        console.error('Erro ao atualizar item no banco de dados MySQL:', err.message);
        // Se houver um erro no DB, e um novo arquivo foi enviado, remova o novo arquivo
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar novo arquivo após falha no DB:', err);
            });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar item.' });
    }
});

// Endpoint para excluir um item (DELETE /items/:id)
app.delete('/items/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const [rows] = await connection.execute(`SELECT image_url FROM items WHERE id = ?`, [itemId]);
        const itemToDelete = rows[0];

        const [result] = await connection.execute(`DELETE FROM items WHERE id = ?`, [itemId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        if (itemToDelete && itemToDelete.image_url && itemToDelete.image_url.startsWith('/uploads/')) {
            const imagePath = path.join(uploadDir, path.basename(itemToDelete.image_url));
            fs.unlink(imagePath, (err) => {
                if (err) console.warn('Aviso: Não foi possível deletar o arquivo de imagem:', imagePath, err.message);
            });
        }

        res.status(200).json({ message: 'Item excluído com sucesso!', id: itemId });
    } catch (err) {
        console.error('Erro ao excluir item do banco de dados MySQL:', err.message);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir item.' });
    }
});


// 5. Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:${PORT}/items para ver os itens (GET)`);
});

// 6. Fechar a conexão com o banco de dados ao encerrar o aplicativo
process.on('SIGINT', async () => {
    if (connection) {
        await connection.end();
        console.log('Conexão com o banco de dados MySQL encerrada.');
    }
    process.exit(0);
});
