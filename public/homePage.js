// const { response } = require("express"); // troublesome line

// task 2.1 - log out

let logoutBtn = new LogoutButton();
logoutBtn.action = function() {
    ApiConnector.logout(answer => {
        if(answer.success) {
            location.reload();
        }
    }); 
}

// task 2.2 - get users information

ApiConnector.current(answer => {
    if(answer.success) {
        ProfileWidget.showProfile(answer.data)
    }
});

// task 2.3 - get stocks

let rBoard = new RatesBoard();
function getCurrentStrocks() {
    ApiConnector.getStocks(answer => {
        if(!answer.success) {
            console.error(answer.error);
        }
        rBoard.clearTable();
        rBoard.fillTable(answer.data);
    });
};
getCurrentStrocks();
let ratesUpdateInterval = setInterval(getCurrentStrocks, 60000);

// task 2.4 - money operations

let monManager = new MoneyManager();

function moneyManagerCallbackTemplate(successMesage, errorMessage) {
    return (answer) => {
        if(answer.success) {
            ProfileWidget.showProfile(answer.data);
        }
        let resultMessage = answer.success ? successMesage : `${errorMessage}:\n${answer.error}`;
        monManager.setMessage(answer.success, resultMessage);
    };
}

monManager.addMoneyCallback = data => { 
    ApiConnector.addMoney(data, moneyManagerCallbackTemplate("Счёт пополнен", "При пополнении произошла ошибка"));
};

monManager.conversionMoneyCallback = data => { 
    ApiConnector.convertMoney(data, moneyManagerCallbackTemplate("Конвертация выполнена", "При конвертации произошла ошибка"));
};

monManager.sendMoneyCallback = data => { 
    ApiConnector.transferMoney(data, moneyManagerCallbackTemplate("Перевод выполнен", "Перевод не выполнен"));
};

// task 2.5 - adding favorite users

let favWidget = new FavoritesWidget();

function favoriteWidgetCallbackTemplate(successMesage, errorMessage) {
    return answer => {
        let resultMessage = answer.success ? successMesage : `${errorMessage}:\n${answer.error}`;
        favWidget.setMessage(answer.success, resultMessage);
        if(!answer.success) {
            return;
        }
        favWidget.clearTable();
        favWidget.fillTable(answer.data);
        monManager.updateUsersList(answer.data);
    };
}

ApiConnector.getFavorites(favoriteWidgetCallbackTemplate("↑ Ваша адресная книга ↑", "Не удалось загрузить адресную книгу"));
  
favWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, favoriteWidgetCallbackTemplate("Пользователь добавлен в адресную книгу", "Не удалось добавить пользователя в адресную книгу"));
};

favWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, favoriteWidgetCallbackTemplate("Пользователь удалён из адресной книги", "Не удалось удалить пользователя из адресной книги"));
};