import React, { useEffect, useState } from "react"; // Asegúrate de importar useEffect y useState
import CreateArticle from './CreateArticle';
import ArticleItem from './ArticleItem';
import { getCategories } from '../services/categoryService'; // Asegúrate de importar esto

const Dashboard = () => {
    const [articles, setArticles] = useState([]); // Estado para los artículos
    const [categories, setCategories] = useState([]); // Estado para las categorías

    // Función para manejar la creación de un nuevo artículo
    const handleArticleCreated = (newArticle) => {
        setArticles([...articles, newArticle]); // Añade el nuevo artículo a la lista
    };

    // Función para cargar las categorías
    const fetchCategories = async () => {
        try {
            const data = await getCategories(); // Llama a tu servicio para obtener categorías
            setCategories(data);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    // Cargar categorías al montar el componente
    useEffect(() => {
        fetchCategories();
    }, []); // Se ejecuta solo una vez al montar

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Esta es una ruta protegida.</p>
            <CreateArticle onArticleCreated={handleArticleCreated} />
           
        </div>
    );
};

export default Dashboard;
