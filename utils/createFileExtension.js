module.exports = (name) => {
    var fileExtension = name.substring(
        name.lastIndexOf(".") + 1,
        name.length
    );

    return fileExtension
}