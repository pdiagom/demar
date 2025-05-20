import React, { useEffect, useState } from "react";
import { getCurrentUser, updateUser } from "../services/authService";
import orderService from "../services/orderService";
import Modal from "./Modal";
import { useLoading } from "../context/loadingContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const { setIsLoading } = useLoading()
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
     setIsLoading(true);
      try {
        await Promise.all([fetchUserData(), fetchUserOrders()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setEditedUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      setError("Error al cargar los pedidos");
    }
  };

  const handleShowOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const orderDetails = await orderService.getOrderDetails(orderId);
      const orderItems = await orderService.getOrderItems(orderId);
      setSelectedOrder({ ...orderDetails, items: orderItems });
      setShowModal(true);
    } catch (err) {
      setError("Error al cargar los detalles del pedido");
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateUser(editedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, "Cancelado");
      fetchUserOrders(); // Actualiza la lista de pedidos
    } catch (err) {
      setError("Error al cancelar el pedido");
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard container">
      <div className="dashboard-menu">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Mi Perfil
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Mis Pedidos
        </button>
      </div>
      {activeTab === "profile" && (
        <div className="profile-section">
          <h2>Mi Perfil</h2>
          {user && (
            <>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-form">
                  <div>
                    <label>Nombre de usuario:</label>
                    <input
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Dirección:</label>
                    <input
                      type="text"
                      name="address"
                      value={editedUser.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Ciudad:</label>
                    <input
                      type="text"
                      name="city"
                      value={editedUser.city || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>País:</label>
                    <input
                      type="text"
                      name="country"
                      value={editedUser.country || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Código postal:</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={editedUser.postalCode || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="user-info">
                  <p>
                    <strong>Nombre de usuario:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {user.phone || "No proporcionado"}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {user.address || "No proporcionada"}
                  </p>
                  <p>
                    <strong>Ciudad:</strong> {user.city || "No especificada"}
                  </p>
                  <p>
                    <strong>País:</strong> {user.country || "No especificado"}
                  </p>
                  <p>
                    <strong>Código postal:</strong>{" "}
                    {user.postalCode || "No especificado"}
                  </p>
                  <button onClick={handleEdit} className="btn-primary">Editar perfil</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {activeTab === "orders" && (
        <div className="orders-section">
          <h2>Mis Pedidos</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.idOrder}>
                  <td>{order.idOrder}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.total}€</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      onClick={() => handleShowOrderDetails(order.idOrder)}
                    >
                      Ver Detalles
                    </button>
                    {order.status === "Pendiente" && (
                      <button onClick={() => handleCancelOrder(order.idOrder)}>
                        Cancelar Pedido
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal show={showModal} onClose={handleCloseModal}>
        {selectedOrder && (
          <div className="order-details">
            <h4>Detalles del Pedido #{selectedOrder.idOrder}</h4>
            <p>Fecha: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p>Estado: {selectedOrder.status}</p>
            <p>Total: {selectedOrder.total}€</p>
            <h5>Artículos:</h5>
            <ul className="order-items">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.article_name} - Cantidad: {item.quantity} - Precio:{" "}
                  {item.article_price}€
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
