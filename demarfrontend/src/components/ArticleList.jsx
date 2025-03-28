import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleItem from "./ArticleItem";
import CategoryFilter from "./CategoryFilter";
import { getCategories } from "../services/categoryService";

const ArticleList = ({ onAddToCart, currentUser }) => {
  // Recibe la función y el usuario como props
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/demar/articles/");
      setArticles(response.data);
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const filteredArticles = selectedCategory
    ? articles.filter(
        (article) => article.categoryId === Number(selectedCategory)
      )
    : articles;

  const renderArticlesList = () => {
    if (filteredArticles.length === 0) {
      return <h3>No hay artículos disponibles</h3>;
    }
    return filteredArticles.map((article) => (
      <ArticleItem
        key={article.idArticle} // Asegúrate de incluir una clave única
        article={article}
        categories={categories}
        onAddToCart={onAddToCart}
        user={currentUser} // Pasa el usuario que contiene el rol
      />
    ));
  };

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(event) => setSelectedCategory(event.target.value)}
      />
      <ul>{renderArticlesList()}</ul>
    </div>
  );
};

export default ArticleList;
