import React, { useState } from 'react';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const ArticleItem = ({ article, categories, onArticleUpdated, onArticleDeleted, onAddToCart}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...article });

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/demar/articles/${article.idArticle}/`, formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error actualizando artículo:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/demar/articles/${article.idArticle}/`);
            onArticleDeleted(article.idArticle); // Notifica que se eliminó el artículo
        } catch (error) {
            console.error('Error eliminando artículo:', error);
        }
    };

    // Encuentra el nombre de la categoría correspondiente usando categoryId
    const category = categories.find(cat => cat.idCategory === article.categoryId);
    const categoryName = category ? category.name : 'Categoría no encontrada';

    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleEditChange} required />
                    <input type="text" name="numRef" value={formData.numRef} onChange={handleEditChange} required />
                    <textarea name="description" value={formData.description} onChange={handleEditChange} required></textarea>
                    <input type="number" name="price" value={formData.price} onChange={handleEditChange} required />
                    <input type="number" name="stock" value={formData.stock} onChange={handleEditChange} required />
                    <CategorySelect selectedCategory={formData.categoryId} onCategoryChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value, 10) })} required />
                    <button type="submit">Actualizar</button>
                </form>
            ) : (
                <div>
                    <h2>{article.name}</h2>
                    <p>Referencia: {article.numRef}</p>
                    <p>Descripción: {article.description}</p>
                    <p>Precio: {article.price}</p>
                    <p>Stock: {article.stock}</p>
                    <p>Categoría: {categoryName}</p> {/* Muestra el nombre de la categoría */}
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                    <button onClick={handleDelete}>Eliminar</button>
                    <button onClick={() => onAddToCart(article)}>Agregar al Carrito</button>
                </div>
            )}
        </li>
    );
};

export default ArticleItem;
