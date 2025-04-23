import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const ArticleItem = ({ article, categories, onAddToCart, user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...article });
    const [newImage, setNewImage] = useState(null);

    // Efecto para sincronizar formData con los cambios en article
    useEffect(() => {
        setFormData({ ...article });
    }, [article]);

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleAddToCart = () => {
        onAddToCart(article);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();

        // Añadir todos los campos de formData al FormData
        Object.keys(formData).forEach(key => {
            if (key !== 'image') { // No añadir la imagen aquí, la añadiremos más tarde
            updatedFormData.append(key, formData[key]);
            }
        });

        // Solo añadir la nueva imagen al FormData si se ha cambiado
        if (newImage) {
            updatedFormData.append('image', newImage);
          } else if (formData['image'] instanceof File) {
            updatedFormData.append('image', formData['image']);
          }
          // Si no hay nueva imagen y la imagen existente no es un File, no la incluyas
          

        console.log('Datos a enviar:', Array.from(updatedFormData.entries()));

        try {
            await axios.put(`http://localhost:8000/demar/articles/${article.idArticle}/`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error actualizando artículo:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/demar/articles/${article.idArticle}/`);
            window.location.reload();
        } catch (error) {
            console.error('Error eliminando artículo:', error);
        }
    };

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
                    <input type="file" onChange={handleImageChange} accept="image/*" />
                    <CategorySelect selectedCategory={formData.categoryId} onCategoryChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value, 10) })} required />
                    <button type="submit">Actualizar</button>
                </form>
            ) : (
                <div>
                    <h2>{article.name}</h2>
                    {article.image && ( // Condición para mostrar la imagen solo si existe
                        <img className="article" src={article.image} alt={article.name} />
                    )}
                    <p>Referencia: {article.numRef}</p>
                    <p>Descripción: {article.description}</p>
                    <p>Precio: {article.price}€</p>
                    <p>Stock: {article.stock}</p>
                    <p>Categoría: {categoryName}</p>
                    
                    {user && user === 1 && ( // Verifica si el usuario es admin
                        <>
                            <button onClick={() => setIsEditing(true)}>Editar</button>
                            <button onClick={handleDelete}>Eliminar</button>
                        </>
                    )}
                    <button onClick={handleAddToCart}>Agregar al Carrito</button>
                </div>
            )}
        </li>
    );
};

export default ArticleItem;
