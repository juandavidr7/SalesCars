import { API_URL } from './config.js';

// Verificación de autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = '/index.html';
    }
};

// Ejecutar verificación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuth);

// Gestión de Usuarios
class UserManager {
    static async getAllUsers() {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const response = await fetch(`${API_URL}/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    static async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Vehículos
class VehicleManager {
    static async getAllVehicles() {
        try {
            const response = await fetch(`${API_URL}/vehiculos`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    static async getVehicleById(id) {
        try {
            const response = await fetch(`${API_URL}/vehiculos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener vehículo ${id}:`, error);
            throw error;
        }
    }

    static async deleteVehicle(id) {
        try {
            const response = await fetch(`${API_URL}/vehiculos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar vehículo ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Compras
class PurchaseManager {
    static async getAllPurchases() {
        try {
            const response = await fetch(`${API_URL}/compras`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener compras:', error);
            throw error;
        }
    }

    static async getPurchaseById(id) {
        try {
            const response = await fetch(`${API_URL}/compras/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener compra ${id}:`, error);
            throw error;
        }
    }

    static async createPurchase(purchaseData) {
        try {
            const response = await fetch(`${API_URL}/compras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(purchaseData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear compra:', error);
            throw error;
        }
    }

    static async updatePurchase(id, purchaseData) {
        try {
            const response = await fetch(`${API_URL}/compras/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(purchaseData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar compra ${id}:`, error);
            throw error;
        }
    }

    static async deletePurchase(id) {
        try {
            const response = await fetch(`${API_URL}/compras/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar compra ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Visitas
class VisitManager {
    static async getAllVisits() {
        try {
            const response = await fetch(`${API_URL}/visitas`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener visitas:', error);
            throw error;
        }
    }

    static async createVisit(visitData) {
        try {
            const response = await fetch(`${API_URL}/visitas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(visitData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear visita:', error);
            throw error;
        }
    }
}

// Manejadores de eventos UI
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    loadDashboardData();

    // Event listeners para navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            showSection(section);
        });
    });

    // Event listeners para formularios
    setupFormListeners();
});

// Función para cargar datos del dashboard
async function loadDashboardData() {
    try {
        const [users, vehicles, purchases, visits] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles(),
            PurchaseManager.getAllPurchases(),
            VisitManager.getAllVisits()
        ]);

        updateUsersTable(users);
        updateVehiclesTable(vehicles);
        updatePurchasesTable(purchases);
        updateVisitsTable(visits);
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showNotification('Error al cargar datos', 'error');
    }
}

// Funciones de actualización de tablas
function updateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${user.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function updateVehiclesTable(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    tableBody.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.price}</td>
            <td>
                <button class="btn btn-danger btn-delete" data-id="${vehicle.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function updatePurchasesTable(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    tableBody.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${purchase.userId}</td>
            <td>${purchase.vehicleId}</td>
            <td>${purchase.date}</td>
            <td>${purchase.amount}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${purchase.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${purchase.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function updateVisitsTable(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    tableBody.innerHTML = visits.map(visit => `
        <tr>
            <td>${visit.userId}</td>
            <td>${visit.vehicleId}</td>
            <td>${visit.date}</td>
            <td>${visit.status}</td>
        </tr>
    `).join('');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para cambiar entre secciones
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector(`#${sectionId}`).style.display = 'block';

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Funciones para manejar modales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    if (modalId === 'purchaseModal') {
        loadModalSelects();
    } else if (modalId === 'visitModal') {
        loadModalSelects();
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        delete form.dataset.id;
    }
}

// Cargar selects en modales
async function loadModalSelects() {
    try {
        const [users, vehicles] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles()
        ]);

        // Actualizar selects de usuarios
        const userSelects = document.querySelectorAll('select[name="userId"]');
        const userOptions = users.map(user => 
            `<option value="${user.id}">${user.name} (${user.email})</option>`
        ).join('');

        userSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un usuario</option>' + userOptions;
        });

        // Actualizar selects de vehículos
        const vehicleSelects = document.querySelectorAll('select[name="vehicleId"]');
        const vehicleOptions = vehicles.map(vehicle => 
            `<option value="${vehicle.id}">${vehicle.brand} ${vehicle.model} (${vehicle.year})</option>`
        ).join('');

        vehicleSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un vehículo</option>' + vehicleOptions;
        });
    } catch (error) {
        console.error('Error al cargar datos para los selects:', error);
        showNotification('Error al cargar datos de los formularios', 'error');
    }
}

// Configuración de listeners para formularios
function setupFormListeners() {
    // Formulario de usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: userForm.name.value,
                email: userForm.email.value,
                phone: userForm.phone.value,
                role: userForm.role.value
            };

            if (userForm.password.value) {
                userData.password = userForm.password.value;
            }

            try {
                const userId = userForm.dataset.userId;
                if (userId) {
                    await UserManager.updateUser(userId, userData);
                    showNotification('Usuario actualizado exitosamente');
                } else {
                    await UserManager.createUser(userData);
                    showNotification('Usuario creado exitosamente');
                }
                hideModal('userModal');
                loadDashboardData();
            } catch (error) {
                showNotification('Error al procesar el usuario', 'error');
            }
        });
    }

    // Formulario de compra
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const purchaseData = {
                userId: purchaseForm.userId.value,
                vehicleId: purchaseForm.vehicleId.value,
                amount: parseFloat(purchaseForm.amount.value),
                date: purchaseForm.date.value
            };

            try {
                const purchaseId = purchaseForm.dataset.purchaseId;
                if (purchaseId) {
                    await PurchaseManager.updatePurchase(purchaseId, purchaseData);
                    showNotification('Compra actualizada exitosamente');
                } else {
                    await PurchaseManager.createPurchase(purchaseData);
                    showNotification('Compra registrada exitosamente');
                }
                hideModal('purchaseModal');
                loadDashboardData();
            } catch (error) {
                showNotification('Error al procesar la compra', 'error');
            }
        });
    }

    // Formulario de visita
    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const visitData = {
                userId: visitForm.userId.value,
                vehicleId: visitForm.vehicleId.value,
                date: visitForm.date.value,
                status: visitForm.status.value
            };

            try {
                await VisitManager.createVisit(visitData);
                showNotification('Visita registrada exitosamente');
                hideModal('visitModal');
                loadDashboardData();
            } catch (error) {
                showNotification('Error al registrar la visita', 'error');
            }
        });
    }

    // Event listeners para botones de edición y eliminación
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.dataset.id;
            const type = e.target.closest('section').id.replace('-section', '');
            handleEdit(type, id);
        } else if (e.target.classList.contains('btn-delete')) {
            const id = e.target.dataset.id;
            const type = e.target.closest('section').id.replace('-section', '');
            handleDelete(type, id);
        }
    });
}

// Manejar edición de elementos
async function handleEdit(type, id) {
    try {
        let data;
        let modalId;

        switch (type) {
            case 'users':
                data = await UserManager.getUserById(id);
                modalId = 'userModal';
                fillUserForm(data);
                break;
            case 'purchases':
                data = await PurchaseManager.getPurchaseById(id);
                modalId = 'purchaseModal';
                await loadModalSelects();
                fillPurchaseForm(data);
                break;
        }

        if (modalId) {
            showModal(modalId);
        }
    } catch (error) {
        console.error(`Error al cargar datos para edición:`, error);
        showNotification('Error al cargar datos', 'error');
    }
}

// Manejar eliminación de elementos
function handleDelete(type, id) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYes');

    confirmMessage.textContent = `¿Está seguro de eliminar este ${type.slice(0, -1)}?`;
    
    confirmYesBtn.onclick = async () => {
        try {
            switch (type) {
                case 'users':
                    await UserManager.deleteUser(id);
                    break;
                case 'vehicles':
                    await VehicleManager.deleteVehicle(id);
                    break;
                case 'purchases':
                    await PurchaseManager.deletePurchase(id);
                    break;
            }
            hideModal('confirmModal');
            showNotification(`${type.slice(0, -1)} eliminado exitosamente`);
            loadDashboardData();
        } catch (error) {
            console.error(`Error al eliminar ${type.slice(0, -1)}:`, error);
            showNotification(`Error al eliminar ${type.slice(0, -1)}`, 'error');
        }
    };

    showModal('confirmModal');
}

// Funciones auxiliares para llenar formularios
function fillUserForm(userData) {
    const form = document.getElementById('userForm');
    form.dataset.userId = userData.id;
    form.name.value = userData.name;
    form.email.value = userData.email;
    form.phone.value = userData.phone;
    form.role.value = userData.role;
    form.password.value = ''; // No mostrar la contraseña actual
}

function fillPurchaseForm(purchaseData) {
    const form = document.getElementById('purchaseForm');
    form.dataset.purchaseId = purchaseData.id;
    form.userId.value = purchaseData.userId;
    form.vehicleId.value = purchaseData.vehicleId;
    form.amount.value = purchaseData.amount;
    form.date.value = purchaseData.date.split('T')[0];
}

// Exportar las clases para uso en otros módulos
export {
    UserManager,
    VehicleManager,
    PurchaseManager,
    VisitManager
};
