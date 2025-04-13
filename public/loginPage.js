'use strict';

let uForm = new UserForm();

uForm.loginFormCallback = function(data) {
    ApiConnector.login(data, response => {
        response.success ? location.reload() : uForm.setLoginErrorMessage(response.error);
    });
}

uForm.registerFormCallback = function(data) {
    ApiConnector.register(data, response => {
        response.success ? location.reload(): uForm.setRegisterErrorMessage(response.error);
    });
}