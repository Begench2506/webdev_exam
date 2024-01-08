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
        let truncatedDescription = b[i].description.split(' ').slice(0, 5).join(' ');
        let truncatedMainObject = b[i].mainObject.split(' ').slice(0, 5).join(' ');
        c += `
        <tr>
            <td>${b[i].name}</td>
            <td class="description-cell" title="${b[i].description}">${truncatedDescription}</td>
            <td class="main-object-cell" title="${b[i].mainObject}">${truncatedMainObject}</td>
            <td><button type="button" class="btn btn-secondary">Выбрать</button></td>
        </tr>`;
    }
    tableRoute.innerHTML = c;
    table.appendChild(tableRoute);

    // Обработчик событий для вывода полного содержания при наведении на ячейку
    const descriptionCells = document.querySelectorAll('.description-cell');
    const mainObjectCells = document.querySelectorAll('.main-object-cell');

    descriptionCells.forEach(cell => {
        cell.addEventListener('mouseover', () => {
            cell.textContent = b.find(route => route.name === cell.parentNode.children[0].textContent).description;
        });

        cell.addEventListener('mouseout', () => {
            cell.textContent = cell.title.split(' ').slice(0, 5).join(' ');
        });
    });

    mainObjectCells.forEach(cell => {
        cell.addEventListener('mouseover', () => {
            cell.textContent = b.find(route => route.name === cell.parentNode.children[0].textContent).mainObject;
        });

        cell.addEventListener('mouseout', () => {
            cell.textContent = cell.title.split(' ').slice(0, 5).join(' ');
        });
    });
}



d();



async function getDataGuides(routeId) {
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides`);
    const data = await response.json();
    return data;
}
