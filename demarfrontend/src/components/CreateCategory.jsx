import React, { useState } from 'react';
import { createCategory } from '../services/categoryService'; 

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setSuccess('');

        const newCategory = {
            name,
            description,
        };

        try {
            await createCategory(newCategory); 
            setSuccess('Categoría creada con éxito');
            setName('');
            setDescription('');
            setTimeout(() => {
                setSuccess('');
                window.location.reload(); 
            }, 3000);

        } catch (error) {
            setError('Error al crear la categoría');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="create-category">
            <h2>Crear Categoría</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="category-form">
                <div>
                    
                    <input
                        type="text"
                        id="name"
                        placeholder='Nombre de la categoría'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    
                    <textarea
                        id="description"
                        placeholder='Descripción de la categoría'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">Crear Categoría</button>
            </form>
        </div>
    );
};

export default CreateCategory;
