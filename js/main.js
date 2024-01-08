async function getData() {
    const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=880ab64c-4356-4119-aa51-19af575a54ae');
    const data = await response.json();
    return data;
}

async function d() {
    let table = document.getElementById("routes");
    let tableRoute = document.createElement("tbody");
    let b = await getData();
    let c = "";

    const itemsPerPage = 10;
    let currentPage = 1;
    let selectedRouteId = null;

    function displayRoutes() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentRoutes = b.slice(startIndex, endIndex);

        let c = "";
        for (let i = 0; i < currentRoutes.length; i++) {
            c += `
                <tr class="clickable" data-description="${currentRoutes[i].description}" data-main-object="${currentRoutes[i].mainObject}" data-route-id="${currentRoutes[i].id}">
                    <td>${currentRoutes[i].name}</td>
                    <td class="description-cell">${currentRoutes[i].description.substring(0, 5) + '...'}</td>
                    <td class="main-object-cell">${currentRoutes[i].mainObject.substring(0, 5) + '...'}</td>
                    <td><button type="button" class="btn btn-secondary" onclick="toggleGuidesTable('${currentRoutes[i].id}')">Выбрать</button></td>
                </tr>`;
        }

        const tableHeader = `
            <thead class="table-secondary" style="background-color: #0b193c; color: white;">
                <tr>
                    <th scope="col">Название</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Основные объекты</th>
                    <th scope="col">Выбор</th>
                </tr>
            </thead>`;

        table.innerHTML = '';
        table.innerHTML += tableHeader;
        table.innerHTML += c;

        const rows = document.querySelectorAll('.clickable');
        rows.forEach(row => {
            row.addEventListener('click', showFullContent);
        });
    }

    displayRoutes();

    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(b.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.classList.add("page-link");
        link.href = "#";
        link.textContent = i;
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Предотвращаем действие по умолчанию
            currentPage = i;
            displayRoutes();
        });
        li.appendChild(link);
        paginationContainer.appendChild(li);
    }

    function toggleGuidesTable(routeId) {
        const guidesTableSection = document.getElementById('guidesTableSection');

        if (selectedRouteId === routeId) {
            // Если выбран тот же маршрут, скрываем таблицу гидов
            guidesTableSection.style.display = 'none';
            selectedRouteId = null; // Сбрасываем выбранный маршрут
        } else {
            // Показываем таблицу гидов для нового выбранного маршрута
            showGuidesTable(routeId);
            selectedRouteId = routeId;
        }
    }
}

async function getGuidesData(routeId) {
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=880ab64c-4356-4119-aa51-19af575a54ae`);
    const data = await response.json();
    return data;
}

async function showGuidesTable(routeId) {
    const guidesTableSection = document.getElementById('guidesTableSection');
    const guidesTableBody = document.getElementById('guidesTableBody');

    const guidesData = await getGuidesData(routeId);

    guidesTableBody.innerHTML = '';

    for (let i = 0; i < guidesData.length; i++) {
        guidesTableBody.innerHTML += `
            <tr>
                <td><img src="${guidesData[i].profileImage}" alt="Профиль"></td>
                <td>${guidesData[i].name}</td>
                <td>${guidesData[i].language}</td>
                <td>${guidesData[i].workExperience}</td>
                <td>${guidesData[i].pricePerHour}</td>
                <td><button type="button" class="btn btn-secondary" onclick="handleGuideSelection('${guidesData[i].fullName}')">Выбрать</button></td>
            </tr>`;
    }

    guidesTableSection.style.display = 'block';
}

function showFullContent() {
    const descriptionCell = this.querySelector('.description-cell');
    const mainObjectCell = this.querySelector('.main-object-cell');

    if (!this.classList.contains('full-content')) {
        descriptionCell.textContent = this.dataset.description;
        mainObjectCell.textContent = this.dataset.mainObject;
        this.classList.add('full-content');

        const routeId = this.dataset.routeId;
        showGuidesTable(routeId);
    } else {
        descriptionCell.textContent = this.dataset.description.substring(0, 5) + '...';
        mainObjectCell.textContent = this.dataset.mainObject.substring(0, 5) + '...';
        this.classList.remove('full-content');

        const guidesTableSection = document.getElementById('guidesTableSection');
        guidesTableSection.style.display = 'none';
    }
}

function handleGuideSelection(guideName) {
    console.log('Гид выбран:', guideName);
}

document.addEventListener('DOMContentLoaded', d);
