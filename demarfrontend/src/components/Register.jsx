import { useState } from "react";
import { register } from "../services/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await register(formData);
        console.log(response);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="city" placeholder="City" onChange={handleChange} />
            <input type="text" name="country" placeholder="Country" onChange={handleChange} />
            <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleChange} />
            <button type="submit">Registrarme</button>
        </form>
    );
};

export default Register;
