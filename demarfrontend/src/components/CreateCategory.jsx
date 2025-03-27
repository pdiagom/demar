import React, { useState } from 'react';
import { createCategory } from '../services/categoryService'; // Importamos el servicio

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setError('');
        setSuccess('');

        const newCategory = {
            name,
            description,
        };

        try {
            await createCategory(newCategory); // Llamar a la función para crear la categoría
            setSuccess('Categoría creada con éxito');
            setName('');
            setDescription('');

            // Limitar el mensaje de éxito a 3 segundos
            setTimeout(() => {
                setSuccess(''); // Limpia el mensaje de éxito después de 3 segundos
            }, 3000);
        } catch (error) {
            setError('Error al crear la categoría');

            // Limitar el mensaje de error a 3 segundos
            setTimeout(() => {
                setError(''); // Limpia el mensaje de error después de 3 segundos
            }, 3000);
        }
    };

    return (
        <div>
            <h2>Crear Categoría</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && (
                <p style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px'
                }}>
                    {success}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Categoría</button>
            </form>
        </div>
    );
};

export default CreateCategory;
