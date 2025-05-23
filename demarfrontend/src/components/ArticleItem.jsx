import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const ArticleItem = ({ article, categories, onAddToCart, user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...article });
    const [newImage, setNewImage] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
    const [searchTerm, setSearchTerm] = useState('');


    // Efecto para sincronizar formData con los cambios en articulos
    useEffect(() => {
        setFormData({ ...article });
    }, [article]);

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleAddToCart = async () => {
    try {
        const stock = await articleService.getStock(article.idArticle);
        const existingItem = JSON.parse(localStorage.getItem('cart'))?.find(i => i.article.idArticle === article.idArticle);
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity < stock) {
            onAddToCart(article);
        } else {
            alert('No puedes añadir más unidades de este artículo. Stock insuficiente.');
        }
    } catch (error) {
        console.error('Error al verificar stock:', error);
        alert('Error al verificar stock del artículo.');
    }
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
            await axios.put(`https://demar.onrender.com/demar/articles/${article.idArticle}/`, updatedFormData, {
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
            await axios.delete(`https://demar.onrender.com/demar/articles/${article.idArticle}/`);
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
                    <input type="number" name="price" value={formData.price} min={0.01} onChange={handleEditChange} required />
                    <input type="number" name="stock" value={formData.stock} min={1} onChange={handleEditChange} required />
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
                    <div className="button-container">
                    {(user === 1 || user=== 2) && ( // Verifica si el usuario es admin o superuser
                        <>
                            <button onClick={() => setIsEditing(true)}>Editar</button>
                            <button onClick={handleDelete}>Eliminar</button>
                        </>
                    )}
                    <button onClick={handleAddToCart}>Agregar al Carrito</button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default ArticleItem;
