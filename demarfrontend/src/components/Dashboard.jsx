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
      setIsLoading(false);
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
      setIsLoading(true);
      const orderDetails = await orderService.getOrderDetails(orderId);
      const orderItems = await orderService.getOrderItems(orderId);
      setSelectedOrder({ ...orderDetails, items: orderItems });
      setShowModal(true);
    } catch (err) {
      setError("Error al cargar los detalles del pedido");
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      const updatedUser = await updateUser(editedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
                  {/* ... (campos del formulario sin cambios) */}
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
                  {/* ... (información del usuario sin cambios) */}
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
                  <td data-label="ID Pedido">{order.idOrder}</td>
                  <td data-label="Fecha">{new Date(order.date).toLocaleDateString()}</td>
                  <td data-label="Total">{order.total}€</td>
                  <td data-label="Estado">{order.status}</td>
                  <td data-label="Acciones">
                    <button
                      onClick={() => handleShowOrderDetails(order.idOrder)}
                      className="btn-primary"
                    >
                      Ver Detalles
                    </button>
                    {order.status === "Pendiente" && (
                      <button 
                        onClick={() => handleCancelOrder(order.idOrder)}
                        className="btn-secondary"
                      >
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
