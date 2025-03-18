import React, { useState } from 'react';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const ArticleItem = ({ article, onArticleUpdated, onArticleDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...article });

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/demar/articles/${article.idArticle}/`, formData);
            onArticleUpdated(response.data); // Notifica el artículo actualizado
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

    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleEditChange} required />
                    <input type="text" name="numRef" value={formData.numRef} onChange={handleEditChange} required />
                    <textarea name="description" value={formData.description} onChange={handleEditChange} required></textarea>
                    <input type="number" name="price" value={formData.price} onChange={handleEditChange} required />
                    <input type="number" name="stock" value={formData.stock} onChange={handleEditChange} required />
                    <CategorySelect selectedCategory={formData.categoryId} onCategoryChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required />
                    <button type="submit">Actualizar</button>
                </form>
            ) : (
                <div>
                    <h2>{article.name}</h2>
                    <p>Referencia: {article.numRef}</p>
                    <p>Descripción: {article.description}</p>
                    <p>Precio: {article.price}</p>
                    <p>Stock: {article.stock}</p>
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                    <button onClick={handleDelete}>Eliminar</button>
                </div>
            )}
        </li>
    );
};

export default ArticleItem;
