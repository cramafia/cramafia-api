export const authResponses = {
    registration: {
        success: {
            message: 'Пользователь успешно создан',
        },
        incorrectData: {
            message: 'Данные не корректны',
        },
    },
    login: {
        incorrectData: {
            message: 'Неверное имя пользователя или пароль',
        },
        success: {
            message: 'Успешный вход',
        },
    },
    isUserExist: {
        exist: {
            message: 'Данное имя пользователя занято',
        },
        notExist: {
            message: 'Данное имя пользователся не занято',
        },
    },
}
