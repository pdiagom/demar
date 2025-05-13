import React, { useEffect, useState } from 'react';
import orderService from '../services/orderService';
import Modal from './Modal';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            setError('No se pudieron cargar los pedidos. Por favor, intente de nuevo más tarde.');
        }
    };

    const handleStatusChange = async (idOrder, newStatus) => {
        console.log(`Attempting to update order ${idOrder} to status ${newStatus}`);
        try {
            const updatedOrder = await orderService.updateOrderStatus(idOrder, newStatus);
            console.log('Order updated successfully:', updatedOrder);
            setOrders(orders.map(order => 
                order.idOrder === idOrder ? updatedOrder : order
            ));
            setEditingOrder(null);
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            setError('No se pudo actualizar el estado del pedido. Por favor, intente de nuevo.');
        }
    };

    const handleDeleteOrder = async (idOrder) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
            try {
                await orderService.deleteOrder(idOrder);
                setOrders(orders.filter(order => order.idOrder !== idOrder));
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
                setError('No se pudo eliminar el pedido. Por favor, intente de nuevo.');
            }
        }
    };

    const handleShowItems = async (orderId) => {
        try {
            const items = await orderService.getOrderItems(orderId);
            setSelectedOrderItems(items);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener los artículos del pedido:', error);
            setError('No se pudieron cargar los artículos del pedido. Por favor, intente de nuevo.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <h3>Lista de Todos los Pedidos</h3>
            <table>
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
                    {orders.map(order => (
                        <tr key={order.idOrder}>
                            <td>{order.idOrder}</td>
                            <td>{order.userId}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.total}€</td>
                            <td>
                                {editingOrder === order.idOrder ? (
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.idOrder, e.target.value)}
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
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>
                                {editingOrder === order.idOrder ? (
                                    <button onClick={() => setEditingOrder(null)}>Guardar</button>
                                ) : (
                                    <button onClick={() => setEditingOrder(order.idOrder)}>Editar</button>
                                )}
                                <button onClick={() => handleDeleteOrder(order.idOrder)}>Eliminar</button>
                                <button onClick={() => handleShowItems(order.idOrder)}>Ver Artículos</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h4>Artículos del Pedido</h4>
                <ul>
                    {selectedOrderItems.map((item, index) => (
                        <li key={index}>{item.article_name} - Cantidad: {item.quantity} - Precio: {item.article_price}€</li>
                    ))}
                </ul>
            </Modal>
        </div>
    );
};

export default OrderList;
