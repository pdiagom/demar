import React, { useState } from 'react';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const CreateArticle = ({ onArticleCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        numRef: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '', 
        image: null,
    });

    const [successMessage, setSuccessMessage] = useState('');
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] }); 
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
        } else {
            formDataToSend.append(key, formData[key] || '');
        }
    });

    try {
        const response = await axios.post('https://demar.onrender.com/demar/articles/', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setSuccessMessage('Artículo creado correctamente!');
        setFormData({ name: '', numRef: '', description: '', price: '', stock: '', categoryId: '', image: null }); 
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    } catch (error) {
        console.error('Error creando artículo:', error.response?.data || error.message); 
    }
};
    return (
        <div className="create-article">
        <h2>Crear Artículo</h2>
         {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
            <input type="text" name="numRef" placeholder="Número de Referencia" value={formData.numRef} onChange={handleChange} required />
            <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required></textarea>
            <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required />
            <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            <CategorySelect selectedCategory={formData.categoryId} onCategoryChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required />
            <button type="submit" className="btn-primary">Crear Artículo</button>
        </form>
        </div>
    );
};

export default CreateArticle;