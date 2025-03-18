import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateArticle from './CreateArticle';
import ArticleItem from './ArticleItem';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);

    const fetchArticles = async () => {
        const response = await axios.get('http://localhost:8000/demar/articles/');
        setArticles(response.data);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleArticleCreated = (newArticle) => {
        setArticles([...articles, newArticle]); // Añade el nuevo artículo a la lista
    };

    const handleArticleUpdated = (updatedArticle) => {
        setArticles(articles.map(article => article.id === updatedArticle.id ? updatedArticle : article));
    };

    const handleArticleDeleted = (id) => {
        setArticles(articles.filter(article => article.id !== id)); // Elimina el artículo de la lista
    };

    return (
        <div>
            <h1>Lista de Artículos</h1>
            <CreateArticle onArticleCreated={handleArticleCreated} />
            <ul>
                {articles.map(article => (
                    <ArticleItem 
                        key={article.id} 
                        article={article} 
                        onArticleUpdated={handleArticleUpdated}
                        onArticleDeleted={handleArticleDeleted}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;
