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

monManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, answer => {
        if(answer.success) {
            ProfileWidget.showProfile(answer.data);
        }
        let resultMessage = answer.success ? "Счёт пополнен" : `При пополнении произошла ошибка:\n${answer.error}`;
        monManager.setMessage(answer.success, resultMessage);
    });
};

monManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, answer => {
        if(answer.success) {
            ProfileWidget.showProfile(answer.data);
        }
        let resultMessage = answer.success ? "Конвертация выполнена" : `При конвертации произошла ошибка:\n${answer.error}`;
        monManager.setMessage(answer.success, resultMessage);
    });
};

monManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, answer => {
        if(answer.success) {
            ProfileWidget.showProfile(answer.data);
        }
        let resultMessage = answer.success ? "Перевод выполнен" : `Перевод не выполнен:\n${answer.error}`;
        monManager.setMessage(answer.success, resultMessage);
    });
};

// task 2.4 - adding favourite users

let favWidget = new FavoritesWidget();

function callbackStencil(successMesage, errorMessage) {
    return answer => {
        let resultMessage = answer.success ? successMesage : `${errorMessage}:\n${answer.error}`;
        favWidget.setMessage(answer.success, resultMessage);
        if(!answer.success) {
            return;
        }
        favWidget.clearTable();
        favWidget.fillTable(answer.data);
        monManager.updateUsersList(answer.data);
    }
}

ApiConnector.getFavorites(callbackStencil("↑ Ваша адрессная книга ↑", "Не удалось загрузить адрессную книгу"));
  
favWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, callbackStencil("Пользователь добавлен в адрессную книгу", "Не удалось добавить пользователя в адрессную книгу"));
};

favWidget.removeUserCallback = data => {
    ApiConnector.addUserToFavorites(data, callbackStencil("Пользователь удалён из адрессной книги", "Не удалось удалить пользователя из адрессной книги"));
};


// ApiConnector.getFavorites(answer => {
//     let resultMessage = answer.success ? "↑ Ваша адрессная книга ↑" : `Не удалось загрузить адрессную книгу:\n${answer.error}`;
//     favWidget.setMessage(answer.success, resultMessage);
//     if(!answer.success) {
//         return;
//     }
//     favWidget.clearTable();
//     favWidget.fillTable(answer.data);
//     monManager.updateUsersList(answer.data);
// });

// favWidget.addUserCallback = data => {
//     ApiConnector.addUserToFavorites(data, answer => {
//         let resultMessage = answer.success ? "Пользователь добавлен в адрессную книгу" : `Не удалось добавить пользователя в адрессную книгу:\n${answer.error}`;
//         favWidget.setMessage(answer.success, resultMessage);
//         if(!answer.success) {
//             return;
//         }
//         favWidget.clearTable();
//         favWidget.fillTable(answer.data);
//         monManager.updateUsersList(answer.data);
//     });
// };

// favWidget.removeUserCallback = data => {
//     ApiConnector.removeUserFromFavorites(data, answer => {
//         let resultMessage = answer.success ? "Пользователь удалён из адрессной книги" : `Не удалось удалить пользователя из адрессной книги:\n${answer.error}`;
//         favWidget.setMessage(answer.success, resultMessage);
//         if(!answer.success) {
//             return;
//         }
//         favWidget.clearTable();
//         favWidget.fillTable(answer.data);
//         monManager.updateUsersList(answer.data);
//     });
// };