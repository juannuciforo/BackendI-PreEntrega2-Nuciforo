import express from 'express';
import ProductManager from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

// Rutas para products
router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
    try {
        const product = productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/', (req, res) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        req.app.get('io').emit('updateProducts', productManager.getProducts());
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = productManager.updateProduct(pid, req.body);
        req.app.get('io').emit('updateProducts', productManager.getProducts());
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    try {
        productManager.deleteProduct(pid);
        req.app.get('io').emit('updateProducts', productManager.getProducts());
        res.status(200).send(`Producto con id ${pid} eliminado`);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

export default router;