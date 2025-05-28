import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

const CategorySelect = ({
  selectedCategory,
  onCategoryChange,
  required = true,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Llama al servicio para obtener categorías
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select
      value={selectedCategory}
      onChange={onCategoryChange}
      required={required}
    >
      <option value="">Seleccionar categoría</option>
      {categories.map((category) => (
        <option key={category.idCategory} value={category.idCategory}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
