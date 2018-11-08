import QtQuick 2.0
import QtQml.StateMachine 1.0


Rectangle {

    property var i: -1
    property var j: -1
    property var value: 0
    property var info: ""
    property var isOpen: false
    property var type: 0
    property var leftClickHandler: null
    property var rightClickHandler: null
    property var visitedCallback: null
    property var isTaged: false

    width:  40
    height: 40
    color:  "#A7B9B9"

    Text {
        width:  40
        height: 40
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        text: info
    }

    MouseArea {
        anchors.fill: parent;
        acceptedButtons: Qt.LeftButton
        onClicked: leftClickHandler(parent)
    }

    MouseArea {
        anchors.fill: parent;
        acceptedButtons: Qt.RightButton
        onClicked: {
            if (isOpen) return;
            if (!isTaged) {
                info = "?";
                color = "#cdd2ff";
                isTaged = true;
            } else {
                info = "";
                color = "#A7B9B9";
                isTaged = false;
            }
        }
    }

    onValueChanged: {
        if (value === 0)
            type = 0
        else if (value === -1)
            type = -1
        else 
            type = 1
    }

    onIsOpenChanged: {
        info = ""
        if (isOpen) {
            switch(type){
                case 0:
                    color = "#ffffff";
                    break;
                case -1:
                    color = "#ff0000"
                    break;
                case 1:
                    color.r = 1
                    color.g = 1 - value / 10 * 1.25;
                    color.b = 1 - value / 10 * 1.25;
                    info = value;
            }
            if (visitedCallback) {
                visitedCallback();
                visitedCallback= null
            }
        }
        else {
            color = "#A7B9B9"
        }
    }
}