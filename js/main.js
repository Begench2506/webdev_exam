let selectedRouteId = null;

async function getData() {
    const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=880ab64c-4356-4119-aa51-19af575a54ae');
    const data = await response.json();
    return data;
}

async function getGuidesData(routeId) {
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=880ab64c-4356-4119-aa51-19af575a54ae`);
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
    let selectedGuideId = null;

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
            event.preventDefault();
            currentPage = i;
            displayRoutes();
        });
        li.appendChild(link);
        paginationContainer.appendChild(li);
    }

    function toggleGuidesTable(routeId) {
        const guidesTableSection = document.getElementById('guidesTableSection');
        const submitRequestBtn = document.getElementById('submitRequestBtn');

        if (selectedRouteId === routeId) {
            guidesTableSection.style.display = 'none';
            submitRequestBtn.style.display = 'none';
            selectedRouteId = null;
        } else {
            showGuidesTable(routeId);
            selectedRouteId = routeId;
        }
    }
}

async function showGuidesTable(routeId) {
    const guidesTableSection = document.getElementById('guidesTableSection');
    const submitRequestBtn = document.getElementById('submitRequestBtn');
    const selectedGuideInfo = document.getElementById('selectedGuideInfo');

    const guidesData = await getGuidesData(routeId);

    guidesTableBody.innerHTML = '';

    for (let i = 0; i < guidesData.length; i++) {
        guidesTableBody.innerHTML += `
            <tr>
                <td><img url(../images/user.png)></td>
                <td>${guidesData[i].name}</td>
                <td>${guidesData[i].language}</td>
                <td>${guidesData[i].workExperience}</td>
                <td>${guidesData[i].pricePerHour}</td>
                <td><button type="button" class="btn btn-secondary" onclick="handleGuideSelection('${guidesData[i].id}', '${guidesData[i].name}')">Выбрать</button></td>
            </tr>`;
    }

    guidesTableSection.style.display = 'block';
    submitRequestBtn.style.display = 'none';
}
function toggleGuidesTable(routeId) {
    const selectedRouteName = document.querySelector(`tr[data-route-id="${routeId}"] td:first-child`).textContent;
    document.getElementById('selectedRoute').textContent = selectedRouteName; // Установка выбранного маршрута в модальном окне
    myModal.show();
}
function handleGuideSelection(guideId, guideName, routeName) {
    // Сохраняем выбранное название маршрута для последующего использования
    const submitRequestBtn = document.getElementById('submitRequestBtn');
    const selectedGuideInfo = document.getElementById('selectedGuideInfo');

    // Обновляем содержимое модального окна информацией о выбранном маршруте и гиде
    selectedGuideInfo.innerHTML = `${guideName}`;

    submitRequestBtn.style.display = 'block';
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

document.addEventListener('DOMContentLoaded', d);

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const mainObjects = await getMainObjects();
        console.log('mainObjects:', mainObjects);
        populateMainObjectDropdown(mainObjects);

        const routes = await getData();
        console.log('routes:', routes);
        displayRoutes(routes);
    } catch (error) {
        console.error('Error during page initialization:', error);
    }
});

async function parser() {
    let oObject = [];
    let dataq = await getData();
    let rez
    for (let i = 0; i < dataq.length; i++) {
        rez = "";

        for (let k = 0; k < dataq[i].mainObject.length; k++) {

            if (dataq[i].mainObject[k] == "-" || dataq[i].mainObject[k] == "," || dataq[i].mainObject[k] == "." || dataq[i].mainObject[k] == "n") {
                if (rez.length > 4 && rez.length < 50) {
                    oObject.push(rez);
                    rez = ""
                }
            }
            else {
                rez += dataq[i].mainObject[k];
            }
        }
    }

    return oObject;
}

async function populateMainObjectDropdown(mainObjects) {
    let data = await getData()
    let storeData = await parser(data)
    for (let i = 0; i < storeData.length; i++) {
        let v = document.createElement('option')
        v.text = storeData[i]
        v.value = i
        mainObjectFilter.appendChild(v)
    };
    

}

populateMainObjectDropdown()

async function applyFilters() {
    const selectedMainObjectId = document.getElementById('mainObjectFilter').value;
    const routeNameFilter = document.getElementById('routeNameSearch').value.toLowerCase();

    const routes = await getData();

    const filteredRoutes = routes.filter(route => {
        const matchesMainObject = selectedMainObjectId === '' || route.main_object_id === parseInt(selectedMainObjectId);
        const matchesRouteName = route.name.toLowerCase().includes(routeNameFilter);
        return matchesMainObject && matchesRouteName;
    });

    displayRoutes(filteredRoutes);

    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.style.display = 'none';
}

function displayRoutes(routes) {
    const table = document.getElementById('routes');
    const tableHeader = `
        <thead class="table-secondary" style="background-color: #0b193c; color: white;">
            <tr>
                <th scope="col">Название</th>
                <th scope="col">Описание</th>
                <th scope="col">Основные объекты</th>
                <th scope="col">Выбор</th>
            </tr>
        </thead>`;

    let tableBody = '';

    for (const route of routes) {
        tableBody += `
            <tr class="clickable" data-description="${route.description}" data-main-object="${route.mainObject}" data-route-id="${route.id}">
                <td>${route.name}</td>
                <td class="description-cell">${route.description.substring(0, 5) + '...'}</td>
                <td class="main-object-cell">${route.mainObject.substring(0, 5) + '...'}</td>
                <td><button type="button" class="btn btn-secondary" onclick="toggleGuidesTable('${route.id}')">Выбрать</button></td>
            </tr>`;
    }

    table.innerHTML = tableHeader + tableBody;

    const rows = document.querySelectorAll('.clickable');
    rows.forEach(row => {
        row.addEventListener('click', showFullContent);
    });
}

document.getElementById('submitRequestBtn').addEventListener('click', function() {
    if (selectedRouteId !== null && selectedGuideId !== null) {
        console.log('Оформление заявки для маршрута:', selectedRouteId, 'и гида:', selectedGuideId);
        // Добавьте здесь код для обработки оформления заявки
    } else {
        console.log('Выберите маршрут и гида перед оформлением заявки.');
    }
});


// let selectedRoute = '';
// let selectedGuide = '';

// document.getElementById('routesTable').addEventListener('click', function(event) {
//     if (event.target.tagName === 'BUTTON') {
//         selectedRoute = event.target.dataset.routeName;
//     }
// });

// document.getElementById('guidesTable').addEventListener('click', function(event) {
//     if (event.target.tagName === 'BUTTON') {
//         selectedGuide = event.target.dataset.guideName;
//     }
// });

// function openModal() {
//     if (selectedRoute && selectedGuide) {
//         document.getElementById('selectedRoute').textContent = selectedRoute;
//         document.getElementById('selectedGuide').textContent = selectedGuide;

//         var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
//             keyboard: false
//         });
//         myModal.show();
//     } 

    
    
