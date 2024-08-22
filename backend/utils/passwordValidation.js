//Importation des dépendances
const passwordValidator = require('password-validator');

//Prerequis d'un mot de passe valide
module.exports = (password) => {
    if (!password)
        return {
            isSuccess: false,
            failedReason : "Le mot de passe est obligatoire !"
        };

    const schema = new passwordValidator();
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123', '12345678', 'azertyui']);

    const failedValidationResults = schema.validate(password, { details: true });
    if (!Array.isArray(failedValidationResults))
        return {
            isSuccess: false,
            failedReason : "Une erreur s'est produite !"
        };
    
    if (failedValidationResults.length > 0)
        return {
            isSuccess: false,
            failedReason : failedValidationResults.map(m => m.message).join('\n')
        };

    return {
        isSuccess: true,
        failedReason : ""
    };
};