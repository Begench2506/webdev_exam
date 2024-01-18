const apiEndpoints = {
    routes: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=880ab64c-4356-4119-aa51-19af575a54ae',
    guides: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=880ab64c-4356-4119-aa51-19af575a54ae',
    orders: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=880ab64c-4356-4119-aa51-19af575a54ae'
};

async function getOrders(api) {
    const response = await fetch(api);
    const data = await response.json();
    return data;
}
async function deleteOrder(oId) {
    try {
        const responce = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${oId}?api_key=880ab64c-4356-4119-aa51-19af575a54ae`, {
            method: 'DELETE'
        });

        if (responce.ok) {
            const data = await responce.json();
            return { success: true, data };
        } else {
            throw new Error('Не удалось удалить заявку');
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}


async function displayOrdersInTable() {
    const orders = await getOrders(apiEndpoints.orders);
    const tableBody = document.getElementById('ordersBody');

    // Очистка текущих данных в таблице
    tableBody.innerHTML = '';

    // Заполнение таблицы данными из API
    orders.forEach(async (order) => {
        const row = document.createElement('tr');
        const modifiedGuidesApi = apiEndpoints.guides.replace('{id-маршрута}', `${order.route_id}`);
        const guides = await getOrders(modifiedGuidesApi);
        const routes = await getOrders(apiEndpoints.routes);

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${routes.find(route => route.id === order.route_id)?.name || 'Неизвестно'}</td>
            <td>${guides.find(guide => guide.id === order.guide_id)?.name || 'Неизвестно'}</td>
            <td>${order.date}</td>
            <td>${order.time}</td>
            <td>${order.duration} ч. </td>
            <td>${order.persons}</td>
            <td>${order.price} &#8381</td>
            <td>
                <span class="buttons">
                    <button class="trashButton"><img src="images/trash.png" height="30px" ></button>
                    <button class="eyeButton"><img src="images/eye.png" height="30px" ></button>
                    <button class="penButton"><img src="images/pen.png" height="30px" ></button>
                </span>
            </td>
            
        `;
        tableBody.appendChild(row);
        clickTrashButton();
        clickEyeButton();
    });
}

function clickTrashButton() {
    document.querySelectorAll('.trashButton').forEach(button => {
        button.addEventListener('click', showDeleteModal);
    });
}

async function showDeleteModal(event) {
    const selectedRow = event.target.closest('tr');
    orderNum = selectedRow.querySelector('td:nth-child(1)').textContent;

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    document.getElementById('confirmDelete').addEventListener('click', async function () {
        deleteModal.hide();
        const deleteResult = await deleteOrder(orderNum);

        if (deleteResult.success) {
            showMessage('Заявка успешно удалена. Обновите страницу для отображения изменений', 'success');
            displayOrdersInTable();
        } else {
            showMessage('Не удалось удалить заявку, повторите попытку позже.', 'failed');
        }
    });
}

function clickEyeButton() {
    document.querySelectorAll('.eyeButton').forEach(button => {
        button.addEventListener('click', showOrderModal);
    });
}

async function showOrderModal(event) {
    const selectedRow = event.target.closest('tr');
    const orderNum = selectedRow.querySelector('td:nth-child(1)').textContent;

    const modalTitle = document.getElementById('staticBackdropLabel');
    const selectedRouteInfo = document.getElementById('selectedRouteInfo');
    const selectedGuideInfo = document.getElementById('selectedGuideInfo');
    const selectedDateInfo = document.getElementById('selectedDateInfo');
    const selectedStartTimeInfo = document.getElementById('selectedStartTimeInfo');
    const selectedDurationInfo = document.getElementById('selectedDurationInfo');
    const selectedPersonsInfo = document.getElementById('selectedPersonsInfo');
    const selectedPriceInfo = document.getElementById('selectedPriceInfo');

    try {
        // Получение данных для выбранного заказа
        const selectedOrder = await getOrders(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${orderNum}?api_key=880ab64c-4356-4119-aa51-19af575a54ae`);

        // Получение дополнительной информации
        const routeInfo = await getOrders(apiEndpoints.routes);
        const guideInfo = await getOrders(apiEndpoints.guides.replace('{id-маршрута}', `${selectedOrder.route_id}`));

        // Обновление содержимого модального окна
        modalTitle.textContent = `Просмотр деталей заявки № ${selectedOrder.id}`;
        selectedRouteInfo.textContent = routeInfo.find(route => route.id === selectedOrder.route_id)?.name || 'Неизвестно';
        selectedGuideInfo.textContent = guideInfo.find(guide => guide.id === selectedOrder.guide_id)?.name || 'Неизвестно';
        selectedDateInfo.textContent = selectedOrder.date;
        selectedStartTimeInfo.textContent = selectedOrder.time;
        selectedDurationInfo.textContent = `${selectedOrder.duration} ч.`;
        selectedPersonsInfo.textContent = selectedOrder.persons;
        selectedPriceInfo.textContent = `${selectedOrder.price} ₽`;

        // Вывод модального окна
        const staticBackdrop = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        staticBackdrop.show();

    } catch (error) {
        console.error('Ошибка при получении деталей заказа:', error);
    }
}


displayOrdersInTable();

function showMessage(text, category = "success") {
    let messBox = document.querySelector('.status');
    let newMess = document.createElement('div');
    newMess.innerHTML = text;
    messBox.append(newMess);
    setTimeout(() => newMess.remove(), 10000)
    if (category === 'failed') {
        newMess.classList.add('status_failed')
    }
    else if (category === 'success') {
        newMess.classList.add('status_success')
    }
}