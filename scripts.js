function toggleAboutUsMenu() {
    const subMenu = document.getElementById('aboutUsSubMenu');
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
    closeOtherSubMenus('aboutUsSubMenu');
}

function toggleServicesMenu() {
    const subMenu = document.getElementById('servicesSubMenu');
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
    closeOtherSubMenus('servicesSubMenu');
}

function toggleshowSearch() {
    const subMenu = document.getElementById('searchSubMenu');
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
    closeOtherSubMenus('searchSubMenu');
}

function closeOtherSubMenus(exceptMenuId) {
    const subMenus = ['aboutUsSubMenu', 'servicesSubMenu', 'searchSubMenu'];
    subMenus.forEach(menuId => {
        if (menuId !== exceptMenuId) {
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.style.display = 'none';
            }
        }
    });
}

// Funciones para mostrar diferentes secciones
function showMission() {
    hideAllSections();
    document.getElementById('aboutUsSection').style.display = 'block';
    document.getElementById('missionSection').style.display = 'block';
}

function showVision() {
    hideAllSections();
    document.getElementById('aboutUsSection').style.display = 'block';
    document.getElementById('visionSection').style.display = 'block';
}

function showValues() {
    hideAllSections();
    document.getElementById('aboutUsSection').style.display = 'block';
    document.getElementById('valuesSection').style.display = 'block';
}

function showConsultation() {
    hideAllSections();
    document.getElementById('servicesSection').style.display = 'block';
}

function showRadiology() {
    hideAllSections();
    document.getElementById('servicesSection').style.display = 'block';
}

function toggleAppointmentForm() {
    hideAllSections();
    document.getElementById('appointmentForm').style.display = 'block';
}

function searchService() {
    hideAllSections();
    document.getElementById('searchSection').style.display = 'block';
}

function searchDoctor() {
    hideAllSections();
    document.getElementById('searchSection').style.display = 'block';
}

function showContact() {
    hideAllSections();
    document.getElementById('contactSection').style.display = 'block';
}

function goHome() {
    hideAllSections();
    document.getElementById('sliderContainer').style.display = 'block';
}

function hideAllSections() {
    const sections = [
        'sliderContainer', 
        'aboutUsSection', 
        'servicesSection', 
        'appointmentForm', 
        'searchSection', 
        'contactSection',
        'missionSection', 
        'visionSection', 
        'valuesSection'
    ];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}
let slideIndex = 0;
const slides = document.getElementsByClassName('slide');

function showSlides() {
    // Ocultar todos los slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    // Incrementar el índice del slide
    slideIndex++;

    // Reiniciar al primer slide si se pasa del último
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Mostrar el slide actual
    slides[slideIndex - 1].style.display = 'block';

    // Cambiar al siguiente slide cada 5 segundos
    setTimeout(showSlides, 5000);
}

// Iniciar el slider cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    showSlides();
});

//Función para cargar médicos por especialidad
function cargarMedicos() {
    const especialidadSelect = document.getElementById('especialidad');
    const medicoSelect = document.getElementById('id_medico');

    // Limpiar opciones anteriores de médicos
    medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>';
    medicoSelect.disabled = true;  // Deshabilitar select de médicos por defecto

    const especialidad = especialidadSelect.value;
    if (!especialidad) return;  // Si no se selecciona especialidad, salir

    const formData = new FormData();
    formData.append('especialidad', especialidad);

    fetch('obtener_medicos.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(medicos => {
        medicoSelect.disabled = false; // Habilitar el select de médicos
        if (medicos.length > 0) {
            medicos.forEach(medico => {
                const option = document.createElement('option');
                option.value = medico.id_medico;
                option.textContent = medico.nombre_completo;
                medicoSelect.appendChild(option);
            });
        } else {
            alert('No se encontraron médicos para esta especialidad.');
        }
    })
    .catch(error => {
        console.error('Error al cargar médicos:', error);
        alert('No se pudieron cargar los médicos. Por favor, intente más tarde.');
    });
}

// Función para mostrar tabla de médicos
function mostrarTablaMedicos(medicos, especialidad) {
    // Crear o seleccionar contenedor de médicos
    let seccionMedicos = document.getElementById('doctorsSection');
    if (!seccionMedicos) {
        seccionMedicos = document.createElement('div');
        seccionMedicos.id = 'doctorsSection';
        seccionMedicos.className = 'info-container';
        document.body.appendChild(seccionMedicos);
    }

    // Limpiar contenido anterior
    seccionMedicos.innerHTML = `<h2>Médicos de ${especialidad}</h2>`;

    // Crear tabla si hay médicos
    if (medicos.length > 0) {
        const tabla = document.createElement('table');
        tabla.className = 'doctors-table';
        
        // Crear encabezados
        const encabezados = ['ID', 'Nombre Completo'];
        const encabezadosHTML = encabezados.map(
            encabezado => `<th>${encabezado}</th>`
        ).join('');
        
        // Crear filas de médicos
        const filasHTML = medicos.map(medico => `
            <tr>
                <td>${medico.id_medico}</td>
                <td>${medico.nombre_completo}</td>
            </tr>
        `).join('');

        // Insertar tabla
        tabla.innerHTML = `
            <thead>
                <tr>${encabezadosHTML}</tr>
            </thead>
            <tbody>
                ${filasHTML}
            </tbody>
        `;

        // Añadir tabla a la sección
        seccionMedicos.appendChild(tabla);
    } else {
        // Mensaje si no hay médicos
        seccionMedicos.innerHTML += '<p>No hay médicos disponibles para esta especialidad.</p>';
    }

    // Mostrar sección de médicos
    seccionMedicos.style.display = 'block';
}

// Añadir evento de cambio al select de especialidad
document.addEventListener('DOMContentLoaded', () => {
    const especialidadSelect = document.getElementById('especialidad');
    especialidadSelect.addEventListener('change', cargarMedicos);
});