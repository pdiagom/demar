// src/components/CategoryFilter.jsx

import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <div>

            <select value={selectedCategory} onChange={onCategoryChange}>
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                    <option key={category.idCategory} value={category.idCategory}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;
