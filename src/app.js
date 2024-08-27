import __dirname from './utils.js';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { router as viewsRouter } from './routes/viewsRouter.js';
import ProductManager from './dao/productManager.js';

const app = express();
const productManager = new ProductManager();

// Se configuran Handlebars
app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para la vista de productos
app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.render('index', { products });
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Se ha conectado un cliente con id ${socket.id}`)

  socket.emit('updateProducts', productManager.getProducts());

  socket.on('addProduct', (productData) => {
      try {
          const newProduct = productManager.addProduct(productData);
          io.emit('updateProducts', productManager.getProducts());
          socket.emit('productAdded', newProduct);
      } catch (error) {
          console.error('Error al agregar producto:', error.message);
          socket.emit('productError', error.message);
      }
      // Se agrega un producto y avisa por consola si hay algún error
  });

  socket.on('deleteProduct', (productId) => {
    console.log('Solicitud de eliminación recibida para el producto ID:', productId);
    try {
      const deletedProduct = productManager.deleteProduct(productId);
      console.log('Producto eliminado:', deletedProduct);
      io.emit('updateProducts', productManager.getProducts());
      socket.emit('productDeleted', deletedProduct);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      socket.emit('productError', error.message);
    }
      // Se elimina un producto y avisa por consola si hay algún error
  });
});

export { app, io };