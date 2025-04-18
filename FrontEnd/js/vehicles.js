import { API_URLS } from './config.js';

class VehiclesAPI {
    constructor() {
        this.baseUrl = API_URLS.vehiculos;
    }

    // Obtener todos los vehículos
    async getAllVehicles() {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos`);
            if (!response.ok) {
                throw new Error('Error al obtener los vehículos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener un vehículo por ID
    async getVehicleById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el vehículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Buscar vehículos con filtros
    async searchVehicles(filters) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/buscar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filters)
            });
            if (!response.ok) {
                throw new Error('Error al buscar vehículos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener todas las marcas
    async getBrands() {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas`);
            if (!response.ok) {
                throw new Error('Error al obtener las marcas');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener modelos por marca
    async getModelsByBrand(brand) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas/${brand}/modelos`);
            if (!response.ok) {
                throw new Error('Error al obtener los modelos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener vehículos destacados (primeros 3)
    async getFeaturedVehicles() {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos?limit=3`);
            if (!response.ok) {
                throw new Error('Error al obtener los vehículos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener años disponibles por marca y modelo
    async getYearsByBrandAndModel(brand, model) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas/${brand}/modelos/${model}/años`);
            if (!response.ok) {
                throw new Error('Error al obtener los años');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

// Clase para manejar la interfaz de usuario de vehículos
class VehiclesUI {
    constructor() {
        this.api = new VehiclesAPI();
        this.initializeEventListeners();
        this.loadBrands();
        this.loadFeaturedVehicles();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Evento para el filtro de marca
        const marcaFilter = document.getElementById('marcaFilter');
        if (marcaFilter) {
            marcaFilter.addEventListener('change', () => this.handleBrandChange());
        }

        // Evento para el filtro de modelo
        const modeloFilter = document.getElementById('modeloFilter');
        if (modeloFilter) {
            modeloFilter.addEventListener('change', () => this.handleModelChange());
        }

        // Evento para el botón de búsqueda
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
    }

    // Cargar marcas en el select
    async loadBrands() {
        try {
            const response = await this.api.getBrands();
            const marcaFilter = document.getElementById('marcaFilter');
            
            if (marcaFilter) {
                marcaFilter.innerHTML = '<option value="">Marca</option>';
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(brand => {
                        const option = document.createElement('option');
                        option.value = brand;
                        option.textContent = brand;
                        marcaFilter.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            alert('Error al cargar las marcas. Por favor, recarga la página.');
        }
    }

    // Manejar cambio de marca
    async handleBrandChange() {
        const marcaFilter = document.getElementById('marcaFilter');
        const modeloFilter = document.getElementById('modeloFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (marcaFilter && modeloFilter && yearFilter) {
            const selectedBrand = marcaFilter.value;
            
            // Resetear modelos y años
            modeloFilter.innerHTML = '<option value="">Modelo</option>';
            yearFilter.innerHTML = '<option value="">Año</option>';
            
            if (selectedBrand) {
                try {
                    const response = await this.api.getModelsByBrand(selectedBrand);
                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach(model => {
                            const option = document.createElement('option');
                            option.value = model;
                            option.textContent = model;
                            modeloFilter.appendChild(option);
                        });
                    } else {
                        modeloFilter.innerHTML = '<option value="">No hay modelos disponibles</option>';
                    }
                } catch (error) {
                    console.error('Error al cargar modelos:', error);
                    modeloFilter.innerHTML = '<option value="">Error al cargar modelos</option>';
                }
            }
        }
    }

    // Manejar cambio de modelo
    async handleModelChange() {
        const marcaFilter = document.getElementById('marcaFilter');
        const modeloFilter = document.getElementById('modeloFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (marcaFilter && modeloFilter && yearFilter) {
            const selectedBrand = marcaFilter.value;
            const selectedModel = modeloFilter.value;
            
            // Resetear años
            yearFilter.innerHTML = '<option value="">Año</option>';
            
            if (selectedBrand && selectedModel) {
                try {
                    const response = await this.api.getYearsByBrandAndModel(selectedBrand, selectedModel);
                    if (response.success && response.data.length > 0) {
                        response.data.forEach(year => {
                            const option = document.createElement('option');
                            option.value = year;
                            option.textContent = year;
                            yearFilter.appendChild(option);
                        });
                    } else {
                        yearFilter.innerHTML = '<option value="">No hay años disponibles</option>';
                    }
                } catch (error) {
                    console.error('Error al cargar años:', error);
                    yearFilter.innerHTML = '<option value="">Error al cargar años</option>';
                }
            }
        }
    }

    // Manejar búsqueda
    async handleSearch() {
        const filters = {
            marca: document.getElementById('marcaFilter').value,
            modelo: document.getElementById('modeloFilter').value,
            año: document.getElementById('yearFilter').value,
            precio_min: document.getElementById('minPrice').value,
            precio_max: document.getElementById('maxPrice').value
        };

        // Validar que al menos haya un filtro seleccionado
        if (!filters.marca && !filters.modelo && !filters.año && !filters.precio_min && !filters.precio_max) {
            alert('Por favor, selecciona al menos un criterio de búsqueda');
            return;
        }

        try {
            const response = await this.api.searchVehicles(filters);
            if (response.success) {
                this.displayResults(response.data);
                // Desplazar la página a la sección de resultados
                document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error al buscar vehículos:', error);
            alert('Error al realizar la búsqueda. Por favor, intenta nuevamente.');
        }
    }

    // Mostrar resultados
    displayResults(vehicles) {
        const resultsContainer = document.querySelector('#resultados .models-grid');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            
            if (vehicles.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No se encontraron vehículos que coincidan con los criterios de búsqueda.</p>';
                return;
            }
            
            vehicles.forEach(vehicle => {
                const vehicleCard = this.createVehicleCard(vehicle);
                resultsContainer.appendChild(vehicleCard);
            });
        }
    }

    // Crear tarjeta de vehículo
    createVehicleCard(vehicle) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        
        card.innerHTML = `
            <div class="vehicle-image">
                <img src="assets/vehicles/${vehicle.marca.toLowerCase()}_${vehicle.modelo.toLowerCase()}.jpg" 
                     alt="${vehicle.marca} ${vehicle.modelo}"
                     onerror="this.src='assets/vehicles/default.jpg'">
            </div>
            <div class="vehicle-info">
                <h3>${vehicle.marca} ${vehicle.modelo}</h3>
                <p>Año: ${vehicle.año}</p>
                <p>Precio: $${vehicle.precio.toLocaleString()}</p>
                <p>Kilometraje: ${vehicle.kilometraje.toLocaleString()} km</p>
                <button class="view-details" data-id="${vehicle.id}">Ver Detalles</button>
            </div>
        `;

        // Agregar evento para ver detalles
        const viewDetailsBtn = card.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => this.showVehicleDetails(vehicle.id));
        }

        return card;
    }

    // Mostrar detalles del vehículo
    async showVehicleDetails(id) {
        try {
            const response = await this.api.getVehicleById(id);
            if (response.success) {
                // Aquí puedes implementar la lógica para mostrar los detalles
                console.log('Detalles del vehículo:', response.data);
                // Por ejemplo, abrir un modal con los detalles
            }
        } catch (error) {
            console.error('Error al obtener detalles del vehículo:', error);
        }
    }

    // Cargar vehículos destacados
    async loadFeaturedVehicles() {
        try {
            const response = await this.api.getFeaturedVehicles();
            if (response.success) {
                this.displayFeaturedVehicles(response.data);
            }
        } catch (error) {
            console.error('Error al cargar vehículos destacados:', error);
        }
    }

    // Mostrar vehículos destacados
    displayFeaturedVehicles(vehicles) {
        const featuredContainer = document.querySelector('.featured-models .models-grid');
        if (featuredContainer) {
            featuredContainer.innerHTML = '';
            
            // Limitar a 3 vehículos
            const limitedVehicles = vehicles.slice(0, 3);
            
            limitedVehicles.forEach(vehicle => {
                const vehicleCard = this.createVehicleCard(vehicle);
                featuredContainer.appendChild(vehicleCard);
            });
        }
    }
}

// Inicializar la interfaz cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new VehiclesUI();
}); 