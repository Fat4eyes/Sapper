import QtQuick 2.0

Rectangle {
    property int    buttonWidth:    40
    property int    buttonHeight:   40
    property string buttonText:     ""
    property string buttonId:     "X"

    width:  buttonWidth
    height: buttonHeight
    color:  "#A7B9B9"

    Text {
        width:  buttonWidth
        height: buttonHeight
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        text: buttonText
    }

    signal click(string id)

    MouseArea {
        anchors.fill: parent;
        onClicked: {
            click(parent.buttonId)
        }
    }
}