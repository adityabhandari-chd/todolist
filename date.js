exports.getDate = function() {
    const today = new Date();
    const currentDay = today.getDay();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return day = today.toLocaleDateString("en-US", options);

}

exports.getDay = function() {
    const today = new Date();
    const currentDay = today.getDay();
    const options = {
        weekday: "long"
    };
    return day = today.toLocaleDateString("en-US", options);

}
console.log(module.exports);