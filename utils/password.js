var generator = require('generate-password');

module.exports = () => {
    var password = generator.generateMultiple(1, {
        length: 10,
        uppercase: true,
        numbers:true
    });

    return password;
}