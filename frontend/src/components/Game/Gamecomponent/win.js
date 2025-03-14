
// WinScene.js
export const defineWinScene = (k, setShowSudoku) => {
    const BASE_WIDTH = 160;
    const BASE_HEIGHT = 144;
  
    k.scene("win", () => {
      k.add([
        k.text("You Won!", { size: 16 }),
        k.pos(BASE_WIDTH / 2, BASE_HEIGHT / 2 - 20),
        k.anchor("center"),
        k.layer("ui"),
      ]);
  
      k.add([
        k.text("Press R to Replay", { size: 12 }),
        k.pos(BASE_WIDTH / 2, BASE_HEIGHT / 2 + 20),
        k.anchor("center"),
        k.layer("ui"),
      ]);
  
      // Handle "R" key press to replay
      k.onKeyPress("r", () => {
        // Reset any necessary state
        setShowSudoku(false); // Ensure Sudoku overlay is hidden
        window.location.href = "/home";
      });
    });
  };