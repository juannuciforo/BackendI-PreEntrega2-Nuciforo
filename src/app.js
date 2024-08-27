import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { router as viewsRouter } from './routes/viewsRouter.js';
import ProductManager from './dao/productManager.js';  // Importamos ProductManager

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const productManager = new ProductManager();  // Creamos una instancia de ProductManager

// Se configuran los handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Se hace accessible io para las routes
app.set('io', io);

app.use('/', viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Se configura WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('addProduct', (product) => {
    productManager.addProduct(product);
    io.emit('updateProducts', productManager.getProducts());
  });

  socket.on('deleteProduct', (productId) => {
    productManager.deleteProduct(productId);
    io.emit('updateProducts', productManager.getProducts());
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

export { app, io };