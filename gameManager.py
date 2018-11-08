import json
import random
from contextlib import closing

from PyQt5 import QtCore
from PyQt5.QtWidgets import QWidget


class GameManager(QWidget):
    def __init__(self, width, height, minesCount):
        self.__width = width
        self.__height = height
        self.__minesCount = minesCount
        self.__minesMatrix = self.generate_matrix()
        self.__visitMatrix = self.generate_matrix()
        super().__init__()

    @QtCore.pyqtSlot(result='QVariant')
    def get_settings(self):
        return json.dumps({
            'Width': self.__width,
            'Height': self.__height,
            'MinesCount': self.__minesCount
        })

    @QtCore.pyqtSlot('QVariant', result='QVariant')
    def get_matrix(self, key):
        data = json.loads(key)
        self.__minesMatrix = self.generate_mines(int(data[0]), int(data[1]))
        return json.dumps({
            'Matrix': self.__minesMatrix,
            'VisitMatrix': self.__visitMatrix
        })

    @QtCore.pyqtSlot('QVariant')
    def save(self, data):
        with closing(QtCore.QFile('save')) as f:
            if f.open(QtCore.QFile.WriteOnly):
                f.write(bytes(data, 'UTF-8'))
            else:
                print('Failed to read %r' % f.fileName())

    @QtCore.pyqtSlot(result='QVariant')
    def load(self):
        with closing(QtCore.QFile('save')) as f:
            if f.open(QtCore.QFile.ReadOnly):
                jsonData = bytes(f.readAll()).decode('UTF-8')
                if jsonData.__len__() == 0:
                    return jsonData
                data = json.loads(jsonData)
                self.__minesMatrix = data['Matrix']
                self.__visitMatrix = data['VisitMatrix']
                return jsonData
            else:
                print('Failed to read %r' % f.fileName())

    def generate_mines(self, n, m):
        matrix = self.generate_matrix()
        mines_count = self.__minesCount
        not_mines = [[n - 1, m - 1], [n - 1, m], [n - 1, m + 1],
                     [n, m - 1], [n, m], [n, m + 1],
                     [n + 1, m + 1], [n + 1, m], [n + 1, m - 1]]
        while mines_count > 0:
            i = random.randint(0, self.__height - 1)
            j = random.randint(0, self.__width - 1)
            if matrix[i][j] != -1:
                if not [i, j] in not_mines:
                    matrix[i][j] = -1
                    mines_count -= 1

        for i in range(self.__height):
            for j in range(self.__width):
                if matrix[i][j] == -1:
                    if i - 1 >= 0 and j - 1 >= 0:
                        self.increment_cell(matrix, i - 1, j - 1)
                    if i - 1 >= 0:
                        self.increment_cell(matrix, i - 1, j)
                    if i - 1 >= 0 and j + 1 < self.__width:
                        self.increment_cell(matrix, i - 1, j + 1)
                    if j + 1 < self.__width:
                        self.increment_cell(matrix, i, j + 1)
                    if i + 1 < self.__height and j + 1 < self.__width:
                        self.increment_cell(matrix, i + 1, j + 1)
                    if i + 1 < self.__height:
                        self.increment_cell(matrix, i + 1, j)
                    if i + 1 < self.__height and j - 1 >= 0:
                        self.increment_cell(matrix, i + 1, j - 1)
                    if j - 1 >= 0:
                        self.increment_cell(matrix, i, j - 1)

        return matrix

    def generate_matrix(self):
        matrix = []
        for i in range(self.__height):
            matrix.append([])
            for j in range(self.__width):
                matrix[i].append(0)
        return matrix

    @staticmethod
    def increment_cell(matrix, i, j):
        if matrix[i][j] != -1:
            matrix[i][j] += 1

    pass
