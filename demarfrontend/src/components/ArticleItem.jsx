import React, { useState, useEffect } from "react";
import axios from "axios";
import CategorySelect from "./CategorySelect";
import articleService from "../services/articleService";
import Modal from "./Modal";
import { useCart } from "../context/cartContext";

const ArticleItem = ({ article, categories, onAddToCart, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...article });
  const [newImage, setNewImage] = useState(null);
  const { state } = useCart(); // Accede al estado del carrito
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showStockErrorModal, setShowStockErrorModal] = useState(false);

  // Efecto para sincronizar formData con los cambios en articulos
  useEffect(() => {
    setFormData({ ...article });
  }, [article]);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

    const handleAddToCart = async () => {
    try {
      const stock = await articleService.getStock(article.idArticle);
      const itemInCart = state.cartItems.find(item => item.article.idArticle === article.idArticle);
      const currentQuantity = itemInCart ? itemInCart.quantity : 0;

      if (currentQuantity < stock) {
        onAddToCart(article);
      } else {
        setShowStockErrorModal(true);
      }
    } catch (error) {
      console.error("Error al verificar stock:", error);
      alert("Error al verificar stock del artículo.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();

    // Añadir todos los campos de formData al FormData
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        // No añadir la imagen aquí, la añadiremos más tarde
        updatedFormData.append(key, formData[key]);
      }
    });

    // Solo añadir la nueva imagen al FormData si se ha cambiado
    if (newImage) {
      updatedFormData.append("image", newImage);
    } else if (formData["image"] instanceof File) {
      updatedFormData.append("image", formData["image"]);
    }
    // Si no hay nueva imagen y la imagen existente no es un File, no la incluyas

    console.log("Datos a enviar:", Array.from(updatedFormData.entries()));

    try {
      await axios.put(
        `https://demar.onrender.com/demar/articles/${article.idArticle}/`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando artículo:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://demar.onrender.com/demar/articles/${article.idArticle}/`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error eliminando artículo:", error);
    }
  };

  const category = categories.find(
    (cat) => cat.idCategory === article.categoryId
  );
  const categoryName = category ? category.name : "Categoría no encontrada";

  return (
    <>
      <li>
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleEditChange}
              required
            />
            <input
              type="text"
              name="numRef"
              value={formData.numRef}
              onChange={handleEditChange}
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleEditChange}
              required
            ></textarea>
            <input
              type="number"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              min={0.01}
              step="0.01"
              onChange={handleEditChange}
              required
            />
            <input
              type="number"
              name="stock"
              value={formData.stock === 0 ? "" : formData.stock}
              min={1}
              onChange={handleEditChange}
              required
            />
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <CategorySelect
              selectedCategory={formData.categoryId}
              onCategoryChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: parseInt(e.target.value, 10),
                })
              }
              required
            />
            <button type="submit">Actualizar</button>
          </form>
        ) : (
          <div>
            <h2>{article.name}</h2>
            {article.image && ( // Condición para mostrar la imagen solo si existe
              <img className="article" src={article.image} alt={article.name} />
            )}
            <p>Referencia: {article.numRef}</p>
            <p>
              Descripción:{" "}
              {article.description.length > 50
                ? article.description.slice(0, 50) + "..."
                : article.description}
            </p>
            

            <p>Precio: {article.price}€</p>
            <p>Stock: {article.stock}</p>
            <p>Categoría: {categoryName}</p>
            <div className="button-container">
              {(user === 1 || user === 2) && ( // Verifica si el usuario es admin o superuser
                <>
                  <button onClick={() => setIsEditing(true)}>Editar</button>
                  <button onClick={handleDelete}>Eliminar</button>
                </>
              )}
              <button onClick={() => setShowModal(true)}>Ver detalles</button>
              <button onClick={handleAddToCart}>Agregar al Carrito</button>
            </div>
          </div>
        )}
      </li>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>{article.name}</h2>
        {article.image && (
          <img
            className="article-large"
            src={article.image}
            alt={article.name}
          />
        )}
        <p>Referencia: {article.numRef}</p>
        <p>Descripción: {article.description}</p>
        <p>Precio: {article.price}€</p>
        <p>Stock: {article.stock}</p>
        <p>Categoría: {categoryName}</p>
        <button
          onClick={() => {
            handleAddToCart();
            setShowModal(false);
          }}
        >
          Agregar al Carrito
        </button>
      </Modal>
        <Modal show={showStockErrorModal} onClose={() => setShowStockErrorModal(false)}>
        <h2>Error de Stock</h2>
        <p>No puedes añadir más unidades de este artículo. Stock insuficiente.</p>
        <button onClick={() => setShowStockErrorModal(false)}>Cerrar</button>
      </Modal>
    </>
  );
};

export default ArticleItem;
