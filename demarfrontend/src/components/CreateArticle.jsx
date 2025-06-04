import React, { useState, useRef } from "react";
import axios from "axios";
import CategorySelect from "./CategorySelect";

const CreateArticle = ({ onArticleCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    numRef: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.length < 3) {
          error = "El nombre debe tener al menos 3 caracteres";
        }
        break;
      case "numRef":
        if (value.length < 2) {
          error = "El número de referencia debe tener al menos 2 caracteres";
        }
        break;
      case "description":
        if (value.length < 10) {
          error = "La descripción debe tener al menos 10 caracteres";
        }
        break;
      case "price":
        if (value <= 0) {
          error = "El precio debe ser mayor que 0";
        }
        break;
      case "stock":
        if (value < 0) {
          error = "El stock no puede ser negativo";
        }
        break;
      case "categoryId":
        if (!value) {
          error = "Debe seleccionar una categoría";
        }
        break;
      case "image":
        if (!value) {
          error = "Debe seleccionar una imagen";
        }
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    let newValue;
    if (name === "image") {
      newValue = files[0];
    } else if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    } else {
      newValue = value;
    }

    setFormData({ ...formData, [name]: newValue });

    const fieldError = validateField(name, newValue);
    setErrors({ ...errors, [name]: fieldError });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key] || "");
        }
      });

      try {
        const response = await axios.post(
          "https://demar.onrender.com/demar/articles/",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSuccessMessage("Artículo creado correctamente!");
        setFormData({
          name: "",
          numRef: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          image: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error(
          "Error creando artículo:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <div className="create-article">
      <h2>Crear Artículo</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            name="numRef"
            placeholder="Número de Referencia"
            value={formData.numRef}
            onChange={handleChange}
            required
          />
          {errors.numRef && <p className="error">{errors.numRef}</p>}
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={formData.price === 0 ? "" : formData.price}
            min={0.01}
            step={0.01}
            onChange={handleChange}
            required
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock === 0 ? "" : formData.stock}
            min={0}
            onChange={handleChange}
            required
          />
          {errors.stock && <p className="error">{errors.stock}</p>}
        </div>
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            required
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <div>
          <CategorySelect
            selectedCategory={formData.categoryId}
            onCategoryChange={(e) =>
              handleChange({ target: { name: "categoryId", value: e.target.value } })
            }
            required
          />
          {errors.categoryId && <p className="error">{errors.categoryId}</p>}
        </div>
        <button type="submit" className="btn-primary">
          Crear Artículo
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
