import React, { useEffect, useState } from 'react';
import orderService from '../services/orderService';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [error, setError] = useState(null);

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

    const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Attempting to update order ${orderId} to status ${newStatus}`);
    try {
        const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
        console.log('Order updated successfully:', updatedOrder);
        setOrders(orders.map(order => 
            order.idOrder === orderId ? {...order, status: newStatus} : order
        ));
        setEditingOrder(null);
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        setError('No se pudo actualizar el estado del pedido. Por favor, intente de nuevo.');
    }
};

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
            try {
                await orderService.deleteOrder(orderId);
                setOrders(orders.filter(order => order.idOrder !== orderId));
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
                setError('No se pudo eliminar el pedido. Por favor, intente de nuevo.');
            }
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
                            <td>{order.userId.username}</td>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
