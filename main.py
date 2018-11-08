import sys

from PyQt5.QtQml import QQmlApplicationEngine
from PyQt5.QtWidgets import QApplication

from gameManager import GameManager


def main():
    app = QApplication(sys.argv)
    engine = QQmlApplicationEngine()
    width = 15
    height = 15
    gameManager = GameManager(width, height, 50)
    engine.rootContext().setContextProperty("gameManager", gameManager)
    engine.load('Views/Window.qml')
    window = engine.rootObjects()[0]
    window.setProperty("title", "Sapper")
    window.setProperty("width", width * 50 + 90)
    window.setProperty("height", height * 50 + 140)
    window.show()
    sys.exit(app.exec_())


if __name__ == '__main__': main()
