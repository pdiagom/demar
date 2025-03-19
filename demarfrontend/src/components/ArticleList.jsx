import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleItem from './ArticleItem';
import { getCategories } from '../services/categoryService'; // Asegúrate de importar esto

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]); // Estado para las categorías

    const fetchArticles = async () => {
        const response = await axios.get('http://localhost:8000/demar/articles/');
        setArticles(response.data);
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories(); // Llama a tu servicio para obtener categorías
            setCategories(data);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories(); // Carga las categorías
    }, []);



    const handleArticleUpdated = (updatedArticle) => {
        setArticles(articles.map(article => article.idArticle === updatedArticle.idArticle ? updatedArticle : article));
    };

    const handleArticleDeleted = (id) => {
        setArticles(articles.filter(article => article.idArticle !== id)); // Elimina el artículo de la lista
    };

    return (
        <div>
            <h1>Lista de Artículos</h1>

            <ul>
                {articles.map(article => (
                    <ArticleItem 
                        key={article.idArticle} 
                        article={article} 
                        categories={categories} // Pasa las categorías
                        onArticleUpdated={handleArticleUpdated}
                        onArticleDeleted={handleArticleDeleted}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;
