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

  useEffect(() => {
    if (Object.keys(errors).length > 0 || successMessage) {
      const timer = setTimeout(() => {
        setErrors({});
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors, successMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(formData.password)) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres y contener letras y números";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Verificar si el usuario o email ya existen
    try {
      const userExistsResponse = await checkUserExists(
        formData.username,
        formData.email
      );
      if (userExistsResponse.usernameExists) {
        newErrors.username = "Este nombre de usuario ya está en uso";
      }
      if (userExistsResponse.emailExists) {
        newErrors.email = "Este email ya está registrado";
      }
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      newErrors.general =
        "Ocurrió un error al verificar el usuario. Por favor, inténtelo de nuevo.";
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
          general:
            "Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        {successMessage && <p className="success">{successMessage}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={formData.address}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={formData.city}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleChange}
          value={formData.country}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          onChange={handleChange}
          value={formData.postalCode}
        />
        {errors.general && <p className="error">{errors.general}</p>}
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
};

export default Register;
