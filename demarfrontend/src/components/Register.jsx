import { useState, useEffect } from "react";
import { register, checkUserExists } from "../services/authService";

const Register = () => {
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = async (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (value.length < 3) {
          error = "El nombre de usuario debe tener al menos 3 caracteres";
        } else {
          try {
            const response = await checkUserExists(value, "");
            if (response.usernameExists) {
              error = "Este nombre de usuario ya está en uso";
            }
          } catch (err) {
            console.error("Error al verificar el nombre de usuario:", err);
          }
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email inválido";
        } else {
          try {
            const response = await checkUserExists("", value);
            if (response.emailExists) {
              error = "Este email ya está registrado";
            }
          } catch (err) {
            console.error("Error al verificar el email:", err);
          }
        }
        break;
      case "password":
        if (!validatePassword(value)) {
          error = "La contraseña debe tener al menos 8 caracteres y contener letras y números";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;

    }
    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const fieldError = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validar todos los campos antes de enviar
    for (const [key, value] of Object.entries(formData)) {
      const fieldError = await validateField(key, value);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { confirmPassword, ...dataToSend } = formData;
        const response = await register(dataToSend);
        console.log(response);
        setSuccessMessage("Usuario creado correctamente");
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error durante el registro:", error);
        setErrors({
          general: "Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        {successMessage && <p className="success">{successMessage}</p>}
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <input
              type={key.includes('password')|| key.includes('confirmPassword') ? 'password' : 'text'}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={handleChange}
              value={value}
              required={['username', 'email', 'password', 'confirmPassword'].includes(key)}
            />
            {errors[key] && <p className="error">{errors[key]}</p>}
          </div>
        ))}
        {errors.general && <p className="error">{errors.general}</p>}
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
};

export default Register;
