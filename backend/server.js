// backend/server.js

// ... (imports e dbConfig)

// Inicializar o aplicativo Express
const app = express();
const PORT = 3000;

// ... (connectToDatabase, cors, bodyParser)

// --- Configuração de Upload de Arquivos com Multer ---
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

// SERVIR ARQUIVOS ESTÁTICOS: Esta linha é crucial para que as imagens sejam acessíveis
app.use('/uploads', express.static(uploadDir)); // <--- VERIFIQUE ESTA LINHA E SEU CAMINHO

// ... (middleware de conexão, endpoints GET/POST/PUT/DELETE, listen, process.on)
