import { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import cloneDeep from "lodash.clonedeep";
import { useEvent } from "./util";
import "./App.css"; 

function App() {
  const UP_ARROW = 38;
  const DOWN_ARROW = 40;
  const LEFT_ARROW = 37;
  const RIGHT_ARROW = 39;

  const [data, setData] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [gameOver, setGameOver] = useState(false);

  const initialize = () => {
    let newGrid = cloneDeep(data);
    addNumber(newGrid);
    addNumber(newGrid);
    setData(newGrid);
  };

  const addNumber = (newGrid) => {
    let added = false;
    let gridFull = false;
    let attempts = 0;

    while (!added) {
      if (gridFull) {
        break;
      }
      let rand1 = Math.floor(Math.random() * 4);
      let rand2 = Math.floor(Math.random() * 4);
      attempts++;

      if (newGrid[rand1][rand2] === 0) {
        newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
        added = true;
      }

      if (attempts > 50) {
        gridFull = true;
        if (checkIfGameOver()) {
          alert("Game Over");
          setGameOver(true);
        }
      }
    }
  };

  const swipeLeft = (dummy) => {
    let oldGrid = data;
    let newArray = cloneDeep(data);

    for (let i = 0; i < 4; i++) {
      let b = newArray[i];
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast++;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newArray)) {
      addNumber(newArray);
    }
    return dummy ? newArray : setData(newArray);
  };

  const swipeRight = (dummy) => {
    let oldData = data;
    let newArray = cloneDeep(data);

    for (let i = 3; i >= 0; i--) {
      let b = newArray[i];
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast--;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }

    if (JSON.stringify(newArray) !== JSON.stringify(oldData)) {
      addNumber(newArray);
    }
    return dummy ? newArray : setData(newArray);
  };

  const swipeDown = (dummy) => {
    let b = cloneDeep(data);
    let oldData = JSON.parse(JSON.stringify(data));

    for (let i = 3; i >= 0; i--) {
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            b[fast][i] = 0;
            fast = slow - 1;
            slow--;
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }

    if (JSON.stringify(b) !== JSON.stringify(oldData)) {
      addNumber(b);
    }
    return dummy ? b : setData(b);
  };

  const swipeUp = (dummy) => {
    let b = cloneDeep(data);
    let oldData = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < 4; i++) {
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            b[fast][i] = 0;
            fast = slow + 1;
            slow++;
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldData) !== JSON.stringify(b)) {
      addNumber(b);
    }
    return dummy ? b : setData(b);
  };

  const checkIfGameOver = () => {
    if (
      JSON.stringify(data) !== JSON.stringify(swipeLeft(true)) ||
      JSON.stringify(data) !== JSON.stringify(swipeDown(true)) ||
      JSON.stringify(data) !== JSON.stringify(swipeRight(true)) ||
      JSON.stringify(data) !== JSON.stringify(swipeUp(true))
    ) {
      return false;
    }
    return true;
  };

  const resetGame = () => {
    setGameOver(false);
    const emptyGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    addNumber(emptyGrid);
    addNumber(emptyGrid);
    setData(emptyGrid);
  };

  const handleKeyDown = (event) => {
    if (gameOver) return;

    switch (event.keyCode) {
      case UP_ARROW:
        swipeUp();
        break;
      case DOWN_ARROW:
        swipeDown();
        break;
      case LEFT_ARROW:
        swipeLeft();
        break;
      case RIGHT_ARROW:
        swipeRight();
        break;
      default:
        break;
    }

    if (checkIfGameOver()) {
      setGameOver(true);
    }
  };

  const Block = ({ num }) => {
    const blockClasses =
      "w-24 h-24 flex items-center justify-center text-2xl font-bold rounded m-1 " +
      (num === 0 ? "bg-gray-200" : "bg-yellow-400");
    return <div className={blockClasses}>{num !== 0 ? num : ""}</div>;
  };

  useEffect(() => {
    initialize();
  }, []);

  useEvent("keydown", handleKeyDown);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {gameOver && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800 mb-4">Game Over</div>
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
      <Swipe
        onSwipeDown={() => swipeDown()}
        onSwipeLeft={() => swipeLeft()}
        onSwipeRight={() => swipeRight()}
        onSwipeUp={() => swipeUp()}
        style={{ overflowY: "hidden" }}
      >
        <div className="grid grid-cols-4 gap-2 p-4 bg-white rounded-lg shadow-lg">
          {data.map((row, oneIndex) =>
            row.map((digit, index) => <Block num={digit} key={index} />)
          )}
        </div>
      </Swipe>
    </div>
  );
}

export default App;
