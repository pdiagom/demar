import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import Modal from "./Modal";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
   const [orderStats, setOrderStats] = useState({
        Pendiente: 0,
        'En Proceso': 0,
        Completado: 0,
        Cancelado: 0
    });
  const [editingOrder, setEditingOrder] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      setError(
        "No se pudieron cargar los pedidos. Por favor, intente de nuevo más tarde."
      );
    }
  };

   const fetchOrderStats = async () => {
        try {
            const stats = await orderService.getOrderStats();
            setOrderStats(stats);
        } catch (error) {
            console.error('Error al obtener las estadísticas de pedidos:', error);
        }
    };

   const handleStatusChange = async (idOrder, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        idOrder,
        newStatus
      );
      setOrders(
        orders.map((order) =>
          order.idOrder === idOrder ? updatedOrder : order
        )
      );
      setEditingOrder(null);
      
      // Actualizar las estadísticas localmente
      setOrderStats(prevStats => {
        const oldStatus = orders.find(order => order.idOrder === idOrder).status;
        return {
          ...prevStats,
          [oldStatus]: prevStats[oldStatus] - 1,
          [newStatus]: prevStats[newStatus] + 1
        };
      });

 
    } catch (error) {
      setError(
        "No se pudo actualizar el estado del pedido. Por favor, intente de nuevo."
      );
    }
  };

  const handleDeleteOrder = async (idOrder) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este pedido?")) {
      try {
        await orderService.deleteOrder(idOrder);
        setOrders(orders.filter((order) => order.idOrder !== idOrder));
      } catch (error) {
        setError("No se pudo eliminar el pedido. Por favor, intente de nuevo.");
      }
    }
  };

    const handleShowItems = async (orderId) => {
    try {
      const orderDetails = await orderService.getOrderDetails(orderId);
      const items = await orderService.getOrderItems(orderId);
      setSelectedOrder({...orderDetails, items});
      setShowModal(true);
    } catch (error) {
      setError(
        "No se pudieron cargar los detalles del pedido. Por favor, intente de nuevo."
      );
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="orders-section">
      <h3>Resumen de Pedidos</h3>
            <div className="order-stats">
                <div className="stat-item">
                    <span className="stat-label">Pendientes:</span>
                    <span className="stat-value">{orderStats.Pendiente}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">En Proceso:</span>
                    <span className="stat-value">{orderStats['En Proceso']}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Completados:</span>
                    <span className="stat-value">{orderStats.Completado}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Cancelados:</span>
                    <span className="stat-value">{orderStats.Cancelado}</span>
                </div>
            </div>
      <h3>Lista de Todos los Pedidos</h3>
       
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Usuario</th>
            <th>Método de pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.idOrder}>
              <td data-label="ID Pedido">{order.idOrder}</td>
              <td data-label="Usuario">{order.userId}</td>
              <td data-label="Método de pago">{order.paymentMethod}</td>
              <td data-label="Total">{order.total}€</td>
              <td data-label="Estado">
                {editingOrder === order.idOrder ? (
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.idOrder, e.target.value)
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td data-label="Fecha">{new Date(order.date).toLocaleDateString()}</td>
              <td data-label="Acciones">
                <div className="button-group">
                  {editingOrder === order.idOrder ? (
                    <button
                      className="btn-primary"
                      onClick={() => setEditingOrder(null)}
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() => setEditingOrder(order.idOrder)}
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteOrder(order.idOrder)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleShowItems(order.idOrder)}
                  >
                    Ver Artículos
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
        {selectedOrder && (
          <div className="order-details">
            <h4>Detalles del Pedido #{selectedOrder.idOrder}</h4>
            <p><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> {selectedOrder.total}€</p>
            <p><strong>Método de pago:</strong> {selectedOrder.paymentMethod}</p>
            <h5>Dirección de envío:</h5>
            <p>{selectedOrder.shippingAddress}</p>
            <p>{selectedOrder.city}, {selectedOrder.postalCode}</p>
            <p>{selectedOrder.country}</p>
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

export default OrderList;
