// GameScene.js
export const defineStage4Scene = (k, setShowSudoku, BASE_WIDTH, BASE_HEIGHT,player) => {
  k.scene("stage4", (score) => {
    const WIDTH = BASE_WIDTH;
    const HEIGHT = BASE_HEIGHT;
    const WALL_THICKNESS = 8;

    // Add background
    k.add([k.sprite("floor"), k.scale(1), k.pos(0, 0), k.layer("bg")]);
    k.add(player)
    player.pos.x = WIDTH / 2;
    player.pos.y = HEIGHT / 2;
    player.play("idie")
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
    k.add([k.text(score), k.pos(4, 4), k.scale(1), k.layer("ui")]);

    // Add enemy
    const enemy = k.add([
      k.sprite("enemy", { anim: "idle" }),
      k.scale(3),
      k.area({ scale: 0.3 }),
      k.pos(WIDTH / 2, 20),
      k.body({ isStatic: true }),
      k.color(100, 100, 100),
      k.anchor("center"),
      "enemy",
      k.layer("obj"),
    ]);

    enemy.onCollide("player", () => setShowSudoku(true));

    k.camPos(WIDTH / 2, HEIGHT / 2);
  });
};