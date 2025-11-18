// Tienda NOVA - JavaScript CON SCROLL INFINITO FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando tienda NOVA...');
    
    // Variables globales
    let allProducts = [];
    let currentProducts = [];
    let visibleCount = 12; // Mostrar 12 productos inicialmente
    let isLoading = false;

    // ========== INICIALIZACIÓN PRINCIPAL ==========
    function initializeAllFunctions() {
        console.log('🔧 Inicializando funciones...');
        
        // Obtener todos los productos
        allProducts = Array.from(document.querySelectorAll('.col-xl-4.col-md-6'));
        currentProducts = [...allProducts];
        
        console.log(`📊 Total de productos encontrados: ${allProducts.length}`);
        
        // 1. Mostrar productos iniciales
        showInitialProducts();
        
        // 2. Inicializar contadores
        updateAllFilterNumbers();
        
        // 3. Inicializar búsqueda
        initializeSearch();
        
        // 4. Inicializar filtros
        initializeFilters();
        
        // 5. Inicializar botones de producto
        initializeProductButtons();
        
        // 6. Inicializar scroll infinito
        initializeInfiniteScroll();
        
        console.log('✅ Todas las funciones inicializadas');
    }

    function showInitialProducts() {
        console.log(`🔄 Mostrando productos iniciales: ${Math.min(visibleCount, currentProducts.length)} de ${currentProducts.length}`);
        
        // Ocultar todos los productos primero
        allProducts.forEach(product => {
            product.style.display = 'none';
        });
        
        // Mostrar solo los primeros productos
        for (let i = 0; i < Math.min(visibleCount, currentProducts.length); i++) {
            if (currentProducts[i]) {
                currentProducts[i].style.display = 'block';
            }
        }
        
        updateResultsInfo();
    }

    function loadMoreProducts() {
        if (isLoading) {
            console.log('⏳ Ya se está cargando, esperando...');
            return;
        }
        
        isLoading = true;
        console.log('📦 Cargando más productos...');
        
        setTimeout(() => {
            const currentVisible = document.querySelectorAll('.col-xl-4.col-md-6[style="display: block"]').length;
            const nextBatch = Math.min(currentVisible + 6, currentProducts.length); // Cargar 6 más
            
            console.log(`📈 Actualmente visibles: ${currentVisible}, Cargando hasta: ${nextBatch}`);
            
            for (let i = currentVisible; i < nextBatch; i++) {
                if (currentProducts[i]) {
                    currentProducts[i].style.display = 'block';
                    console.log(`✅ Mostrando producto ${i + 1}: ${currentProducts[i].querySelector('.product-name').textContent}`);
                }
            }
            
            updateResultsInfo();
            isLoading = false;
            
            // Verificar si ya mostramos todos
            if (nextBatch >= currentProducts.length) {
                console.log('🎉 ¡Todos los productos están visibles!');
            }
        }, 500);
    }

    function initializeInfiniteScroll() {
        console.log('🔄 Inicializando scroll infinito...');
        
        let scrollHandler = function() {
            if (isLoading) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = scrollTop + windowHeight;
            
            console.log(`📊 Scroll: ${scrollTop} + ${windowHeight} = ${scrollPosition} / ${documentHeight}`);
            
            // Cargar más cuando esté a 300px del final
            if (scrollPosition >= documentHeight - 300) {
                const currentVisible = document.querySelectorAll('.col-xl-4.col-md-6[style="display: block"]').length;
                console.log(`🔍 Productos visibles: ${currentVisible}, Total disponibles: ${currentProducts.length}`);
                
                if (currentVisible < currentProducts.length) {
                    console.log('🎯 Activando carga de más productos...');
                    loadMoreProducts();
                } else {
                    console.log('ℹ️ Ya se muestran todos los productos disponibles');
                }
            }
        };

        // Agregar el event listener
        window.addEventListener('scroll', scrollHandler);
        
        // También agregar un botón de "Cargar más" como fallback
        addLoadMoreButton();
    }

    function addLoadMoreButton() {
        // Crear botón de "Cargar más" como alternativa
        const loadMoreButton = document.createElement('button');
        loadMoreButton.className = 'btn btn-primary mt-4 mb-5';
        loadMoreButton.textContent = 'Cargar Más Productos';
        loadMoreButton.style.display = 'block';
        loadMoreButton.style.margin = '0 auto';
        
        loadMoreButton.addEventListener('click', function() {
            loadMoreProducts();
        });
        
        // Insertar después del grid de productos
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.parentNode.insertBefore(loadMoreButton, productsGrid.nextSibling);
        }
    }

    function updateResultsInfo() {
        const visibleProducts = document.querySelectorAll('.col-xl-4.col-md-6[style="display: block"]').length;
        const totalProducts = currentProducts.length;
        const resultsInfo = document.querySelector('.results-info p');
        
        console.log(`📝 Actualizando info: ${visibleProducts} de ${totalProducts} productos`);
        
        if (resultsInfo) {
            if (visibleProducts >= totalProducts) {
                resultsInfo.innerHTML = `Mostrando <strong>todos</strong> los <strong>${totalProducts}</strong> productos`;
            } else {
                resultsInfo.innerHTML = `Mostrando <strong>${visibleProducts}</strong> de <strong>${totalProducts}</strong> productos - <small class="text-muted">Desplázate hacia abajo para ver más</small>`;
            }
        }
    }

    // ========== CONTADORES ==========
    function countRealProducts() {
        const counts = {
            'Routers': 0,
            'Switches': 0, 
            'Access Points': 0,
            'Laptops': 0
        };

        allProducts.forEach(card => {
            const categoryElement = card.querySelector('.product-category');
            const category = categoryElement ? categoryElement.textContent.trim() : '';
            
            if (category.includes('Router') || category === 'Routers') {
                counts['Routers']++;
            } else if (category.includes('Swicht') || category.includes('Switch')) {
                counts['Switches']++;
            } else if (category.includes('Access Point') || category === 'Access Points') {
                counts['Access Points']++;
            } else if (category.includes('Laptop') || category === 'Laptops') {
                counts['Laptops']++;
            }
        });

        return counts;
    }

    function updateAllFilterNumbers() {
        try {
            const realCounts = countRealProducts();
            updateCategoryFilters(realCounts);
        } catch (error) {
            console.error('❌ Error actualizando filtros:', error);
        }
    }

    function updateCategoryFilters(realCounts) {
        const categoryMap = {
            'cat-routers': 'Routers',
            'cat-switches': 'Switches',
            'cat-accesspoints': 'Access Points', 
            'cat-laptops': 'Laptops'
        };

        Object.keys(categoryMap).forEach(catId => {
            const checkbox = document.getElementById(catId);
            if (checkbox && checkbox.nextElementSibling) {
                const label = checkbox.nextElementSibling;
                const categoryName = categoryMap[catId];
                const count = realCounts[categoryName] || 0;
                
                let badge = label.querySelector('.badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'badge bg-primary ms-1';
                    label.appendChild(badge);
                }
                badge.textContent = count;
            }
        });
    }

    // ========== BÚSQUEDA ==========
    function initializeSearch() {
        const searchInput = document.querySelector('.advanced-search input');
        const searchButton = document.querySelector('.advanced-search .btn');

        if (!searchInput || !searchButton) return;

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log(`🔍 Buscando: "${searchTerm}"`);

            currentProducts = allProducts.filter(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
                const productCode = card.querySelector('.product-code').textContent.toLowerCase();
                
                const matches = productName.includes(searchTerm) || 
                               productDescription.includes(searchTerm) || 
                               productCode.includes(searchTerm);
                
                return matches;
            });

            console.log(`🔍 Resultados encontrados: ${currentProducts.length}`);
            showInitialProducts();
        }

        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm.length >= 2 || searchTerm.length === 0) {
                performSearch();
            }
        });
    }

    // ========== FILTROS ==========
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-buttons .btn');
        const categoryCheckboxes = document.querySelectorAll('.filter-group:first-child .form-check-input');
        const brandCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) .form-check-input');
        const priceFilterButton = document.querySelector('.price-filter .btn');

        // Botones de categoría
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const category = this.textContent.trim();
                filterProductsByCategory(category);
            });
        });

        // Checkboxes de categoría
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyAllFilters();
            });
        });

        // Checkboxes de marca
        brandCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyAllFilters();
            });
        });

        // Filtro de precio
        if (priceFilterButton) {
            priceFilterButton.addEventListener('click', function(e) {
                e.preventDefault();
                applyAllFilters();
            });
        }
    }

    function applyAllFilters() {
        const activeCategories = getActiveCategories();
        const activeBrands = getActiveBrands();
        const priceRange = getPriceRange();
        
        console.log('🎯 Aplicando todos los filtros:', {
            categories: activeCategories,
            brands: activeBrands,
            priceRange: priceRange
        });
        
        filterProductsByMultiple(activeCategories, activeBrands, priceRange);
    }

    function getActiveCategories() {
        const activeCategories = [];
        const categoryCheckboxes = document.querySelectorAll('.filter-group:first-child .form-check-input');
        
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const label = checkbox.nextElementSibling.textContent.trim();
                const categoryName = label.split(' ')[0];
                activeCategories.push(categoryName);
            }
        });
        return activeCategories;
    }

    function getActiveBrands() {
        const activeBrands = [];
        const brandCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) .form-check-input');
        
        brandCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const brandName = checkbox.nextElementSibling.textContent.trim();
                activeBrands.push(brandName);
            }
        });
        return activeBrands;
    }

    function getPriceRange() {
        const minInput = document.querySelector('.price-inputs input:first-child');
        const maxInput = document.querySelector('.price-inputs input:last-child');
        
        const minPrice = parseFloat(minInput.value) || 0;
        const maxPrice = parseFloat(maxInput.value) || 999999;
        
        return { minPrice, maxPrice };
    }

    function filterProductsByCategory(category) {
        console.log(`🎯 Filtrando por categoría: ${category}`);
        
        if (category === 'Todos') {
            currentProducts = [...allProducts];
        } else {
            currentProducts = allProducts.filter(card => {
                const productCategory = card.querySelector('.product-category')?.textContent.trim() || '';
                return productCategory.includes(category) || 
                       (category === 'Switches' && productCategory === 'Swicht');
            });
        }
        
        showInitialProducts();
    }

    function filterProductsByMultiple(categories, brands, priceRange) {
        console.log(`🎯 Filtrando por: Categorías=${categories.join(', ')}, Marcas=${brands.join(', ')}, Precio=${priceRange.minPrice}-${priceRange.maxPrice}`);
        
        currentProducts = allProducts.filter(card => {
            // Filtrar por categoría
            const productCategory = card.querySelector('.product-category')?.textContent.trim() || '';
            const normalizedCategory = productCategory === 'Swicht' ? 'Switches' : productCategory;
            const categoryMatch = categories.length === 0 || 
                                categories.some(cat => normalizedCategory.includes(cat));
            
            // Filtrar por marca (buscar en el nombre del producto)
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const brandMatch = brands.length === 0 || 
                             brands.some(brand => productName.includes(brand.toLowerCase()));
            
            // Filtrar por precio
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const priceMatch = price >= priceRange.minPrice && price <= priceRange.maxPrice;
            
            return categoryMatch && brandMatch && priceMatch;
        });
        
        console.log(`✅ Productos después de filtrar: ${currentProducts.length}`);
        showInitialProducts();
    }

    // ========== BOTONES DE PRODUCTO ==========
    function initializeProductButtons() {
        console.log('🔄 Inicializando botones de producto...');
        
        // Usar event delegation para manejar dinámicamente los botones
        document.addEventListener('click', function(e) {
            // Vista rápida
            if (e.target.closest('.quick-view')) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('👁️ Vista rápida clickeada');
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    showQuickViewModal(productCard);
                }
            }
            
            // Detalles
            const detailsButton = e.target.closest('.btn-outline-primary');
            if (detailsButton && detailsButton.textContent.includes('Detalles')) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('📋 Detalles clickeado');
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    showProductDetailsModal(productCard);
                }
            }
        });
    }

    function showQuickViewModal(productCard) {
        try {
            console.log('🔄 Cargando modal de vista rápida...');
            
            const productImage = productCard.querySelector('.product-image img').src;
            const productName = productCard.querySelector('.product-name').textContent;
            const productCode = productCard.querySelector('.product-code').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            const productRating = productCard.querySelector('.product-rating').innerHTML;
            
            console.log('📦 Datos del producto:', { productName, productCode, productPrice });
            
            // Actualizar modal de vista rápida
            document.getElementById('quickViewImage').src = productImage;
            document.getElementById('quickViewTitle').textContent = productName;
            document.getElementById('quickViewCode').textContent = productCode;
            document.getElementById('quickViewPrice').textContent = productPrice;
            document.getElementById('quickViewRating').innerHTML = productRating;
            document.getElementById('quickViewDescription').textContent = productDescription;
            
            const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
            quickViewModal.show();
            
            console.log('✅ Modal de vista rápida mostrado correctamente');
        } catch (error) {
            console.error('❌ Error mostrando modal de vista rápida:', error);
        }
    }

    function showProductDetailsModal(productCard) {
        try {
            console.log('🔄 Cargando modal de detalles...');
            
            const productImage = productCard.querySelector('.product-image img').src;
            const productName = productCard.querySelector('.product-name').textContent;
            const productCode = productCard.querySelector('.product-code').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            const specBadges = productCard.querySelectorAll('.spec-badge');
            const specs = Array.from(specBadges).map(badge => badge.textContent);
            
            console.log('📦 Datos del producto para detalles:', { productName, productCode, productPrice });
            
            // Actualizar modal de detalles
            document.getElementById('detailsImage').src = productImage;
            document.getElementById('detailsTitle').textContent = productName;
            document.getElementById('detailsCode').textContent = productCode;
            document.getElementById('detailsPrice').textContent = productPrice;
            document.getElementById('detailsDescription').textContent = productDescription;
            
            const specsContainer = document.getElementById('detailsSpecs');
            if (specsContainer) {
                specsContainer.innerHTML = '';
                specs.forEach(spec => {
                    const specElement = document.createElement('div');
                    specElement.className = 'spec-item mb-2 p-2 bg-light rounded';
                    specElement.textContent = spec;
                    specsContainer.appendChild(specElement);
                });
            }
            
            const detailsModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
            detailsModal.show();
            
            console.log('✅ Modal de detalles mostrado correctamente');
        } catch (error) {
            console.error('❌ Error mostrando modal de detalles:', error);
        }
    }

    // Inicializar la aplicación
    initializeAllFunctions();
    console.log('🎉 Tienda NOVA con scroll infinito completamente funcional!');
});