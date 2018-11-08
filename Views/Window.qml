import QtQuick 2.9
import QtQuick.Window 2.2
import QtQml.StateMachine 1.0
import "Scripts/manager.js" as Manager
import "Components"

Window
{
    property var manager: new Manager.Manager(root)

	id: root

	Button {
	    id: buttonStart
	    x: 50
	    y: 25
	    buttonWidth: 100
	    buttonHeight: 50
	    buttonId: Manager.HandleButtons.Start
	    buttonText: Manager.HandleButtons.Start
	}

     Button {
	     id: buttonLoad
	     x: 175
	     y: 25
	     buttonWidth: 100
	     buttonHeight: 50
	     buttonId: Manager.HandleButtons.Load
	     buttonText: Manager.HandleButtons.Load
	     onClick: manager.loadGame()
	 }

     Button {
	     id: buttonSave
	     x: 300
	     y: 25
	     buttonWidth: 100
	     buttonHeight: 50
	     buttonId: Manager.HandleButtons.Save
	     buttonText: Manager.HandleButtons.Save
	     opacity: 0
	     onClick: opacity && manager.saveGame()
	 }

	StateMachine {
	    id: stateMachine
        running: true
        initialState: unStarted

        State {
            id: unStarted

            onEntered: {
                manager.loadCells()
            }

            SignalTransition {
				targetState: started
				signal: root.start
			}
        }

        State {
            id: started

            onEntered: {
                buttonSave.opacity = 1
            }

            onExited: {
                buttonSave.opacity = 0
            }

            SignalTransition {
				targetState: unStarted
				signal: buttonStart.click
			}

            SignalTransition {
				targetState: won
				signal: root.win
			}

            SignalTransition {
				targetState: lost
				signal: root.lost
			}
        }

        State {
            id: won

            onEntered: {
            }

            SignalTransition {
				targetState: unStarted
				signal: buttonStart.click
			}
        }

        State {
            id: lost

            onEntered: {
            }

            SignalTransition {
				targetState: unStarted
				signal: buttonStart.click
			}
        }
	}

	signal start()
	signal win()
	signal lost()
}