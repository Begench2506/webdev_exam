async function getOrders() {
    const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=880ab64c-4356-4119-aa51-19af575a54ae');
    const data = await response.json();
    return data;
}

async function displayOrdersInTable() {
    const orders = await getOrders();
    const tableBody = document.getElementById('routesBody');

    // Очистить текущие данные в таблице
    tableBody.innerHTML = '';

    // Заполнить таблицу данными из API
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.routeName}</td>
            <td>${order.cost}</td>
            <td>${order.numberOfPeople}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Вызвать функцию для отображения данных в таблице
displayOrdersInTable();