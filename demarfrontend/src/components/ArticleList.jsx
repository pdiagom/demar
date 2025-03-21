import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleItem from './ArticleItem';
import CategoryFilter from './CategoryFilter'; // Asegúrate de importar tu componente de filtro de categorías
import { getCategories } from '../services/categoryService'; 

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState(''); // Estado para la categoría seleccionada

    const fetchArticles = async () => {
        const response = await axios.get('http://localhost:8000/demar/articles/');
        setArticles(response.data);
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories(); 
            setCategories(data);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories(); 
    }, []);

    const handleArticleUpdated = (updatedArticle) => {
        setArticles(articles.map(article => article.idArticle === updatedArticle.idArticle ? updatedArticle : article));
    };

    const handleArticleDeleted = (id) => {
        setArticles(articles.filter(article => article.idArticle !== id)); 
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value); 
    };


    const filteredArticles = selectedCategory
        ? articles.filter(article => article.categoryId === Number(selectedCategory)) // Asegúrate de que ambos sean del mismo tipo
        : articles; // Si no hay categoría seleccionada, muestra todos los artículos

    const renderArticlesList = () => {
        if (filteredArticles.length === 0) {
            return <h3>No hay artículos disponibles</h3>; 
        }
        return filteredArticles.map(article => (
            <ArticleItem 
                key={article.idArticle} 
                article={article} 
                categories={categories} 
                onArticleUpdated={handleArticleUpdated}
                onArticleDeleted={handleArticleDeleted}
            />
        ));
    };

    return (
        <div>

            <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
            /> 
            <ul>
                {renderArticlesList()} 
            </ul>
        </div>
    );
};

export default ArticleList;
