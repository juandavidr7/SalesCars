import { API_URL } from './config.js';

// Verificación de autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/index.html';
    }
};

// Gestión de Usuario
class UserManager {
    static async updateProfile(userData) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    }

    static async deleteAccount(userId) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            throw error;
        }
    }

    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await fetch(`${API_URL}/usuarios/password-change`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: userId,
                    currentPassword,
                    newPassword
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    }
}

// Gestión de Vehículos
class VehicleManager {
    static async createVehicle(vehicleData) {
        try {
            const response = await fetch(`${API_URL}/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            throw error;
        }
    }

    static async updateVehicle(id, vehicleData) {
        try {
            const response = await fetch(`${API_URL}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
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
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    }

    static async markAsSold(id) {
        try {
            const response = await fetch(`${API_URL}/vehiculos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ estado: 'vendido' })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al marcar vehículo como vendido:', error);
            throw error;
        }
    }
}

// Gestión de Visitas
class VisitManager {
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
    checkAuth();
    setupEventListeners();
    loadUserData();
    loadUserVehicles();
});

function setupEventListeners() {
    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Eliminar cuenta
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', handleDeleteAccount);
    }

    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Formulario de vehículo
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleVehicleCreate);
    }
}

// Funciones de manejo de eventos
async function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

async function handleDeleteAccount() {
    if (confirm('¿Está seguro de eliminar su cuenta? Esta acción no se puede deshacer.')) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await UserManager.deleteAccount(user.id);
            handleLogout();
        } catch (error) {
            showNotification('Error al eliminar cuenta', 'error');
        }
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const form = e.target;

    try {
        const userData = {
            id: user.id,
            nombre: form.profileName.value,
            email: form.profileEmail.value,
            telefono: form.profilePhone.value
        };

        if (form.newPassword.value) {
            await UserManager.changePassword(
                user.id,
                form.currentPassword.value,
                form.newPassword.value
            );
        }

        await UserManager.updateProfile(userData);
        showNotification('Perfil actualizado exitosamente');
    } catch (error) {
        showNotification('Error al actualizar perfil', 'error');
    }
}

async function handleVehicleCreate(e) {
    e.preventDefault();
    const form = e.target;

    try {
        const vehicleData = {
            marca: form.marca.value,
            modelo: form.modelo.value,
            año: form.año.value,
            precio: form.precio.value,
            kilometraje: form.kilometraje.value
        };

        await VehicleManager.createVehicle(vehicleData);
        form.reset();
        showNotification('Vehículo registrado exitosamente');
        loadUserVehicles();
    } catch (error) {
        showNotification('Error al registrar vehículo', 'error');
    }
}

// Funciones de carga de datos
async function loadUserData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.profileName.value = user.name;
            profileForm.profileEmail.value = user.email;
            profileForm.profilePhone.value = user.phone;
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

async function loadUserVehicles() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}/vehiculos?usuario=${user.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const vehicles = await response.json();
        updateVehiclesList(vehicles);
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
}

function updateVehiclesList(vehicles) {
    const container = document.getElementById('myVehiclesContainer');
    if (!container) return;

    container.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card">
            <img src="${vehicle.imagen || 'default-car.jpg'}" alt="${vehicle.marca} ${vehicle.modelo}">
            <h3>${vehicle.marca} ${vehicle.modelo}</h3>
            <p>Año: ${vehicle.año}</p>
            <p>Precio: $${vehicle.precio}</p>
            <p>Kilometraje: ${vehicle.kilometraje} km</p>
            <div class="vehicle-actions">
                <button class="btn btn-primary" onclick="editVehicle(${vehicle.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteVehicle(${vehicle.id})">Eliminar</button>
                ${vehicle.estado !== 'vendido' ? 
                    `<button class="btn btn-success" onclick="markAsSold(${vehicle.id})">Marcar como vendido</button>` : 
                    ''}
            </div>
        </div>
    `).join('');
}

// Funciones auxiliares
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funciones globales para los botones de vehículos
window.editVehicle = async (id) => {
    try {
        const response = await fetch(`${API_URL}/vehiculos/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const vehicle = await response.json();
        
        // Llenar formulario de edición
        const form = document.getElementById('vehicleForm');
        form.marca.value = vehicle.marca;
        form.modelo.value = vehicle.modelo;
        form.año.value = vehicle.año;
        form.precio.value = vehicle.precio;
        form.kilometraje.value = vehicle.kilometraje;
        
        // Cambiar a sección de edición
        document.querySelector('#registrar-vehiculo').classList.remove('hidden');
        document.querySelector('#mis-vehiculos').classList.add('hidden');
    } catch (error) {
        showNotification('Error al cargar vehículo', 'error');
    }
};

window.deleteVehicle = async (id) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
        try {
            await VehicleManager.deleteVehicle(id);
            showNotification('Vehículo eliminado exitosamente');
            loadUserVehicles();
        } catch (error) {
            showNotification('Error al eliminar vehículo', 'error');
        }
    }
};

window.markAsSold = async (id) => {
    try {
        await VehicleManager.markAsSold(id);
        showNotification('Vehículo marcado como vendido');
        loadUserVehicles();
    } catch (error) {
        showNotification('Error al marcar vehículo como vendido', 'error');
    }
};
