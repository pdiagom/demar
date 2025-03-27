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
        categoryId: '', // Almacena la ID de la categoría seleccionada
    });

    const [successMessage, setSuccessMessage] = useState('');
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegúrate de que formData tenga todos los datos correctos
            console.log('Datos enviados:', formData);
            const response = await axios.post('http://localhost:8000/demar/articles/', formData);
            onArticleCreated(response.data); // Notifica el artículo creado
            setSuccessMessage('Artículo creado correctamente!');
            setFormData({ name: '', numRef: '', description: '', price: '', stock: '', categoryId: '' }); // Reinicia el formulario
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error creando artículo:', error.response.data); // Para obtener más detalles
        }
    };

    return (
        <div>
        {successMessage && (
            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                {successMessage}
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
            <input type="text" name="numRef" placeholder="Número de Referencia" value={formData.numRef} onChange={handleChange} required />
            <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required></textarea>
            <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required />
            <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
            <CategorySelect selectedCategory={formData.categoryId} onCategoryChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required />
            <button type="submit">Crear Artículo</button>
        </form>
        </div>
    );
};

export default CreateArticle;
