module.exports = () => {
    const currentTime = new Date();
    const date = ("0" + currentTime.getDate()).slice(-2);
    const month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
    const year = currentTime.getFullYear();
    const hours = ("0" + currentTime.getHours()).slice(-2);
    const minutes = ("0" + currentTime.getMinutes()).slice(-2);
    const seconds = ("0" + currentTime.getSeconds()).slice(-2);
    const miliSeconds = ("0" + currentTime.getMilliseconds()).slice(-2);
    const filename = date.concat(
        month,
        year,
        hours,
        minutes,
        seconds,
        miliSeconds
    );
    return filename;
}