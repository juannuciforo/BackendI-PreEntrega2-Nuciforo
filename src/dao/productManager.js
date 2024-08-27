import { readDataFromFile, writeDataToFile } from '../utils/fileHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/productos.json');

class ProductManager {
    constructor() {
        this.products = readDataFromFile(productsFilePath);
    }

    getProducts() {
        if (this.products.length === 0) {
            return 'La lista de productos está vacía.';
        }
        return this.products;
    }

    addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
      console.log('Intentando agregar producto con código:', code);
      
      if (this.products.some(product => product.code === code)) {
          console.log('Error: Producto con código existente encontrado');
          throw new Error('El código del producto ya existe');
      }

      const newProduct = {
          id: this.generateId(),
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails
      };
      this.products.push(newProduct);
      writeDataToFile(productsFilePath, this.products);
      console.log('Nuevo producto agregado:', newProduct);
      return newProduct;
  }

    getProductById(id) {
        const product = this.products.find(product => product.id == id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        // Evita actualizar el id
        const { id: _, ...fieldsToUpdate } = updatedFields;
        this.products[index] = { ...this.products[index], ...fieldsToUpdate };
        writeDataToFile(productsFilePath, this.products);
        return this.products[index];
    }

    deleteProduct(id) {
      console.log('Intentando eliminar producto con ID:', id);
      const index = this.products.findIndex(p => p.id.toString() === id.toString());
      if (index === -1) {
        console.log('Producto no encontrado');
        throw new Error('Producto no encontrado');
      }
      const deletedProduct = this.products.splice(index, 1)[0];
      writeDataToFile(productsFilePath, this.products);
      console.log('Producto eliminado exitosamente:', deletedProduct);
      return deletedProduct;
    }

    generateId() {
        return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    }
}

export default ProductManager;