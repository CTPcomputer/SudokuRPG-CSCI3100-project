export const defineStage1Scene = (k, setShowSudoku, BASE_WIDTH, BASE_HEIGHT, player) => {
  k.scene("stage1", (score) => {
    const WIDTH = BASE_WIDTH;
    const HEIGHT = BASE_HEIGHT;
    const WALL_THICKNESS = 8;

    player.paused = false;
    // Add background
    k.add([k.sprite("floor"), k.scale(1), k.pos(0, 0), k.layer("bg")]);
    k.add(player);
    player.pos.x = WIDTH / 2;
    player.pos.y = HEIGHT / 2;
    player.play("idie");

    let cat = k.add([
      k.sprite("cat"),
      { anim: "sit1" },
      k.scale(1.5),
      k.pos(20, HEIGHT / 2 + 20),
      k.layer("obj"),
      k.color(100, 200, 27),
      k.area({ scale: 0.5, offset: k.vec2(0, 10) }),
      k.body({ isStatic: true }),
      k.anchor("center"),
      "cat",
    ]);
    cat.play("sit1");

    // Add walls
    const walls = [
      [WIDTH, WALL_THICKNESS, 0, -WALL_THICKNESS],
      [WIDTH, WALL_THICKNESS, 0, HEIGHT],
      [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, -WALL_THICKNESS, -WALL_THICKNESS],
      [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, WIDTH, -WALL_THICKNESS],
    ];

    walls.forEach(([w, h, x, y]) => {
      k.add([
        k.rect(w, h),
        k.pos(x, y),
        k.area(),
        k.body({ isStatic: true }),
        k.color(0, 0, 0),
        "wall",
        k.layer("obj"),
      ]);
    });

    // Add score display
    k.add([k.text(score), k.pos(4, 4), k.scale(0.5), k.layer("ui")]);

    // Add enemy
    const enemy = k.add([
      k.sprite("enemy", { anim: "idle" }),
      k.scale(3),
      k.area({ scale: 0.8 }),
      k.pos(WIDTH / 2, 20),
      k.body({ isStatic: true }),
      k.anchor("center"),
      "enemy",
      k.layer("obj"),
    ]);

    // Dialog setup for enemy
    let enemyDialogActive = false;
    const dialogOverlay = document.getElementById("sudokuDialog");
    const dialogbox = document.getElementById("dialogbox");
    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");
    const gamecanvas = document.getElementById("gameCanvas");
    const enemyDialogueList = [
      ': So, computer are you going to teach us sudoku? ',
      ": ……",
      ": You are so boring ,here is the first question. For the classical sudoku,how many numbers does a sudoku grid require in order to obtain unique solution?",
      ": 17 clues",
      ": Perfect! Face our sudoku and Loss, stranger!"
    ];
    let currentEnemyDialogueList = [...enemyDialogueList]; // Clone to avoid mutating original

    // Dialog setup for cat
    let catDialogActive = false;
    const catDialogueList = [
      "Meow! Want to play with me?",
      "I love chasing lasers!",
      "Purr... Got any treats?",
    ];
    let currentCatDialogueList = [...catDialogueList]; // Clone to avoid mutating original

    // Function to show the enemy dialog
    const showEnemyDialog = () => {
      if (enemyDialogActive || catDialogActive) return; // Prevent multiple dialogs
      enemyDialogActive = true;

      dialogOverlay.style.display = "flex";
      player.paused = true;
      k.timeScale = 0; // Pause game updates
      nextEnemyDialogue();
    };

    const nextEnemyDialogue = () => {
      const currentDialogue = currentEnemyDialogueList.shift();
      if (!currentDialogue) {
        hideEnemyDialog();
        return;
      }
      document.getElementById("dialogue").innerText = currentDialogue;
      if (currentDialogue === ": Perfect! Face our sudoku and Loss, stranger!") {
        yesButton.style.display = "block";
        noButton.style.display = "block";
      } else {
        yesButton.style.display = "none";
        noButton.style.display = "none";
      }
    };

    const hideEnemyDialog = () => {
      player.paused = false;
      dialogOverlay.style.display = "none";
      enemyDialogActive = false;
      k.timeScale = 1; // Resume game updates
      currentEnemyDialogueList = [...enemyDialogueList]; // Reset dialog
      if (gamecanvas) gamecanvas.focus();
    };

    // Function to show the cat dialog
    const showCatDialog = () => {
      if (catDialogActive || enemyDialogActive) return; // Prevent multiple dialogs
      catDialogActive = true;

      dialogOverlay.style.display = "flex";
      k.timeScale = 0; // Pause game updates
      nextCatDialogue();
    };

    const nextCatDialogue = () => {
      const currentDialogue = currentCatDialogueList.shift();
      if (!currentDialogue) {
        hideCatDialog();
        return;
      }
      document.getElementById("dialogue").innerText = currentDialogue;
      yesButton.style.display = "none";
      noButton.style.display = "none";
    };

    const hideCatDialog = () => {
      player.paused = false;
      dialogOverlay.style.display = "none";
      catDialogActive = false;
      k.timeScale = 1; // Resume game updates
      currentCatDialogueList = [...catDialogueList]; // Reset dialog
      if (gamecanvas) gamecanvas.focus();
    };

    // Unified dialog event listeners
    dialogOverlay.addEventListener("click", (event) => {
      if (event.target === dialogOverlay) {
        if (enemyDialogActive) hideEnemyDialog();
        if (catDialogActive) hideCatDialog();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (enemyDialogActive) nextEnemyDialogue();
        if (catDialogActive) nextCatDialogue();
      }
    });

    dialogbox.addEventListener("click", () => {
      if (enemyDialogActive) nextEnemyDialogue();
      if (catDialogActive) nextCatDialogue();
    });

    // Handle "Yes" button click (enemy-specific)
    yesButton.addEventListener("click", () => {
      if (enemyDialogActive) {
        setShowSudoku(true); // Show Sudoku game
        hideEnemyDialog();
        player.paused = true;
      }
    });

    // Handle "No" button click (enemy-specific)
    noButton.addEventListener("click", () => {
      if (enemyDialogActive) {
        hideEnemyDialog();
      }
    });

    // Trigger dialogs on collision
    enemy.onCollide("player", () => {
      showEnemyDialog();
    });

    cat.onCollide("player", () => {
      showCatDialog();
    });

    k.camPos(WIDTH / 2, HEIGHT / 2);
  });
};