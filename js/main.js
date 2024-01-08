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
    for (let i = 0; i < b.length; i++) {
        c += `
        <tr class="clickable" data-description="${b[i].description}" data-main-object="${b[i].mainObject}" data-route-id="${b[i].id}">
            <td>${b[i].name}</td>
            <td class="description-cell">${b[i].description.substring(0, 5) + '...'}</td>
            <td class="main-object-cell">${b[i].mainObject.substring(0, 5) + '...'}</td>
            <td><button type="button" class="btn btn-secondary" onclick="showGuidesTable('${b[i].id}')">Выбрать</button></td>
        </tr>`;
    }
    tableRoute.innerHTML = c;
    table.appendChild(tableRoute);

    // Добавим обработчик событий для кнопок
    const rows = document.querySelectorAll('.clickable');
    rows.forEach(row => {
        row.addEventListener('click', showFullContent);
    });
}
async function getGuidesData(routeId) {
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=880ab64c-4356-4119-aa51-19af575a54ae`);
    const data = await response.json();
    return data;
}

async function showGuidesTable(routeId) {
    const guidesTableSection = document.getElementById('guidesTableSection');
    const guidesTableBody = document.getElementById('guidesTableBody');

    // Получаем данные о гидах
    const guidesData = await getGuidesData(routeId);

    // Очищаем таблицу перед добавлением новых данных
    guidesTableBody.innerHTML = '';

    // Добавляем данные о гидах в таблицу
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

    // Отображаем таблицу гидов
    guidesTableSection.style.display = 'block';
}

function showFullContent() {
    const descriptionCell = this.querySelector('.description-cell');
    const mainObjectCell = this.querySelector('.main-object-cell');

    if (!this.classList.contains('full-content')) {
        // Показываем полное содержимое
        descriptionCell.textContent = this.dataset.description;
        mainObjectCell.textContent = this.dataset.mainObject;
        this.classList.add('full-content');

        // Добавляем вызов функции для отображения таблицы гидов
        const routeId = this.dataset.routeId;
        showGuidesTable(routeId);
    } else {
        // Скрываем полное содержимое
        descriptionCell.textContent = this.dataset.description.substring(0, 5) + '...';
        mainObjectCell.textContent = this.dataset.mainObject.substring(0, 5) + '...';
        this.classList.remove('full-content');

        // Очищаем таблицу гидов при скрытии полного содержимого
        const guidesTableSection = document.getElementById('guidesTableSection');
        guidesTableSection.style.display = 'none';
    }
}

function handleGuideSelection(guideName) {
    // Ваш код для обработки выбора гида
    console.log('Гид выбран:', guideName);
}

// После загрузки страницы показываем сокращенную таблицу
document.addEventListener('DOMContentLoaded', d);
