import React, { useState, useEffect, useRef } from "react";
import userService from "../services/userService";
import SearchBar from "./SearchBar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const editFormRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError("No se pudieron cargar los usuarios.");
    }
  };

  const filterUsers = () => {
    let result = users;

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === parseInt(roleFilter));
    }

    setFilteredUsers(result);
  };

  const handleSearch = (searchTerm) => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(editingUser.id, editingUser);
      setUsers(
        users.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
    } catch (error) {
      setError("No se pudo actualizar el usuario.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        setError("No se pudo eliminar el usuario.");
      }
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 0:
        return "Usuario";
      case 1:
        return "Administrador";
      case 2:
        return "Gestor";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <SearchBar onSearch={handleSearch} />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos los roles</option>
          <option value="0">Usuario</option>
          <option value="1">Administrador</option>
          <option value="2">Gestor</option>
        </select>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Nombre de Usuario">{user.username}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Rol">{getRoleText(user.role)}</td>
              <td data-label="Acciones">
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <form onSubmit={handleSubmit} ref={editFormRef}>
          <h3>Editar Usuario</h3>
          <input
            name="username"
            value={editingUser.username}
            onChange={handleChange}
            placeholder="Nombre de Usuario"
          />
          <input
            name="email"
            value={editingUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <select name="role" value={editingUser.role} onChange={handleChange}>
            <option value="0">Usuario</option>
            <option value="1">Administrador</option>
            <option value="2">Gestor</option>
          </select>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setEditingUser(null)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
