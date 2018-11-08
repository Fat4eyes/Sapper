function loadComponent(componentName) {
    var component = Qt.createComponent(componentName);
    var create = function (rootComponent, properties, signals) {
        var object = component.createObject(rootComponent, properties);

        if (!object) {
            console.log("Error creating object")
            return null;
        }

        for (var key in signals) {
            if (object.hasOwnProperty(key)) {
                object[key].connect(signals[key])
            }
        }

        return object;
    };
    component.create = create;
    while (component.status !== Component.Ready)
        console.log("load", component.status);
    return component;
}

function Timer() {
    return Qt.createQmlObject("import QtQuick 2.0; Timer {}", root);
}

function setTimeout(callback, ms) {
    var timer = new Timer();
    timer.interval = ms;
    timer.repeat = false;
    timer.triggered.connect(callback);
    timer.start();
    return timer;
}

function setInterval(callback, ms) {
    var timer = new Timer();
    timer.interval = ms;
    timer.repeat = true;
    timer.triggered.connect(callback);
    timer.start();
    return timer;
}