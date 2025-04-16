export const defineStage4Scene = (k, setShowSudoku, BASE_WIDTH, BASE_HEIGHT, player) => {
  k.scene("stage4", (score) => {
    const WIDTH = BASE_WIDTH;
    const HEIGHT = BASE_HEIGHT;
    const WALL_THICKNESS = 8;

    player.paused = false;
    // Add background
    k.add([k.sprite("map3"), k.scale(1.5), k.pos(-30, 0), k.layer("bg")]);
    k.add(player);
    player.pos.x = WIDTH / 2;
    player.pos.y = HEIGHT / 2;
    player.play("idie");

    let cat = k.add([
      k.sprite("cat"),
      { anim: "lick1" },
      k.scale(1.5),
      k.pos(20, HEIGHT / 2 + 30),
      k.layer("obj"),
      k.color(100, 200, 27),
      k.area({ scale: 0.5, offset: k.vec2(0, 10) }),
      k.body({ isStatic: true }),
      k.anchor("center"),
      "cat",
    ]);
    cat.play("sleep1");

    // Add walls
    const walls = [
      [WIDTH, WALL_THICKNESS, 0, -WALL_THICKNESS], // Top
      [WIDTH, WALL_THICKNESS, 0, HEIGHT],          // Bottom
      [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, -WALL_THICKNESS * 2, -WALL_THICKNESS], // Left
      [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, WIDTH + WALL_THICKNESS, -WALL_THICKNESS], // Right
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
      k.sprite("enemy4", { anim: "idle" }),
      k.scale(1.5),
      k.area({ scale: 1 }),
      k.pos(WIDTH / 2, 20),
      k.body({ isStatic: true }),
      k.anchor("center"),
      "enemy",
      k.layer("obj"),
    ]);

    // Dialog setup for enemy
    let enemyDialogActive = false;
    let isCollidingWithEnemy = false; // Track collision state
    const dialogOverlay = document.getElementById("sudokuDialog");
    const dialogbox = document.getElementById("dialogbox");
    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");
    const gamecanvas = document.getElementById("gameCanvas");
    const enemyDialogueList = [
      ": Finally, someone debate  Dr Triangle, Terminal, Master Kung Fu. If you win in this final round … you will be our KING, the KING of whole universe and it will be the end of our journey. What is your pronunciation ? Stranger.",
      ": ……CTP",
      ": OK, CTP here is my final question. What is the space complexity of Sudoku?",
      ": O(n^2)",
      ": Let start the final dance, shall we?",
    ];
    let currentEnemyDialogueList = [...enemyDialogueList]; // Clone to avoid mutating original

    // Dialog setup for cat
    let catDialogActive = false;
    let isCollidingWithCat = false; // Track collision state
    const catDialogueList = [
      "Meow! It's the final showdown!",
      "You're so close to being the king!",
      "Purr... Let's finish this with a nap!",
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
      if (currentDialogue === ": Let start the final dance, shall we?") {
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

    // Trigger dialogs on collision with debouncing
    enemy.onCollide("player", () => {
      if (!isCollidingWithEnemy && !enemyDialogActive && !catDialogActive) {
        isCollidingWithEnemy = true;
        showEnemyDialog();
      }
    });

    enemy.onCollideEnd("player", () => {
      isCollidingWithEnemy = false;
    });

    cat.onCollide("player", () => {
      if (!isCollidingWithCat && !catDialogActive && !enemyDialogActive) {
        isCollidingWithCat = true;
        showCatDialog();
      }
    });

    cat.onCollideEnd("player", () => {
      isCollidingWithCat = false;
    });

    k.camPos(WIDTH / 2, HEIGHT / 2);
  });
};