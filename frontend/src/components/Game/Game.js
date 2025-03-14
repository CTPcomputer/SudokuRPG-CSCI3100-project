import React, { useEffect, useState, useRef } from 'react';
import kaplay from "kaplay";
import "./Game.css";
import SudokuGame from '../SudokuGame';

const Game = () => {
  const [showSudoku, setShowSudoku] = useState(false);
  const kRef = useRef(null);
  const canvasRef = useRef(null);
  const k = useRef(null);

  // Initialize game once
  useEffect(() => {
    const BASE_WIDTH = 160;
    const BASE_HEIGHT = 144;

    k.current = kaplay({
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      canvas: canvasRef.current,
      background: [0, 0, 0],
      crisp: true,
      stretch: true,
      letterbox: true,
    });

    kRef.current = k.current;

    // Load assets
    k.current.loadSprite("floor", "sprites/floor.png");
    k.current.loadSprite("enemy", "sprites/enemy1.png", {
      sliceX: 3,
      sliceY: 1,
      anims: { idle: { from: 0, to: 2, loop: true, duration: 100 } },
    });
    k.current.loadSound("bg", "sounds/testbg.mp3");
    k.current.loadSprite("prototype", "sprites/Player.png", {
      sliceX: 3,
      sliceY: 4,
      anims: {
        walkup: { from: 3, to: 5, loop: false },
        stopup: { from: 3, to: 3, loop: false },
        walkdown: { from: 0, to: 2, loop: false },
        stopdown: { from: 0, to: 0, loop: false },
        walkright: { from: 6, to: 8, loop: false },
        stopright: { from: 6, to: 6, loop: false },
        walkleft: { from: 9, to: 11, loop: false, flipX: true },
        stopleft: { from: 9, to: 9, loop: false, flipX: true },
      },
    });

    k.current.scene("game", (score) => {
      const WIDTH = BASE_WIDTH;
      const HEIGHT = BASE_HEIGHT;
      const WALL_THICKNESS = 8;

      k.current.add([k.current.sprite("floor"), k.current.scale(1), k.current.pos(0, 0), k.current.layer("bg")]);

      const walls = [
        [WIDTH, WALL_THICKNESS, 0, -WALL_THICKNESS],
        [WIDTH, WALL_THICKNESS, 0, HEIGHT],
        [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, -WALL_THICKNESS, -WALL_THICKNESS],
        [WALL_THICKNESS, HEIGHT + WALL_THICKNESS * 2, WIDTH, -WALL_THICKNESS],
      ];

      walls.forEach(([w, h, x, y]) => {
        k.current.add([
          k.current.rect(w, h),
          k.current.pos(x, y),
          k.current.area(),
          k.current.body({ isStatic: true }),
          k.current.color(0, 0, 0),
          "wall",
          k.current.layer("obj"),
        ]);
      });

      k.current.add([k.current.text(score), k.current.pos(4, 4), k.current.scale(1), k.current.layer("ui")]);

      const createplayer = k.current.make([
        k.current.sprite("prototype", { frame: 1 }),
        k.current.scale(2),
        k.current.pos(WIDTH / 2, HEIGHT / 2),
        k.current.health(4),
        k.current.area({ scale: 0.5 }),
        k.current.body(),
        k.current.anchor("center"),
        "player",
        k.current.layer("obj"),
      ]);

      const player = k.current.add(createplayer);
      let lastDirection = "right";

      player.onUpdate(() => {
        if (showSudoku) return;

        const speed = 50;
        const diagonalSpeed = speed / Math.sqrt(2);
        let isMoving = false;

        if (k.current.isKeyDown("up")) {
          isMoving = true;
          if (k.current.isKeyDown("right")) {
            player.move(diagonalSpeed, -diagonalSpeed);
            player.play("walkup");
            player.flipX = false;
            lastDirection = "right";
          } else if (k.current.isKeyDown("left")) {
            player.move(-diagonalSpeed, -diagonalSpeed);
            player.play("walkup");
            player.flipX = true;
            lastDirection = "left";
          } else {
            player.move(0, -speed);
            player.play("walkup");
            player.flipX = lastDirection === "left";
          }
        } else if (k.current.isKeyDown("down")) {
          isMoving = true;
          if (k.current.isKeyDown("right")) {
            player.move(diagonalSpeed, diagonalSpeed);
            player.play("walkdown");
            player.flipX = false;
            lastDirection = "right";
          } else if (k.current.isKeyDown("left")) {
            player.move(-diagonalSpeed, diagonalSpeed);
            player.play("walkdown");
            player.flipX = true;
            lastDirection = "left";
          } else {
            player.move(0, speed);
            player.play("walkdown");
            player.flipX = false;
          }
        } else if (k.current.isKeyDown("right")) {
          isMoving = true;
          player.move(speed, 0);
          player.flipX = false;
          if (player.curAnim() !== "walkright") {
            player.play("walkright");
            lastDirection = "right";
          }
        } else if (k.current.isKeyDown("left")) {
          isMoving = true;
          player.move(-speed, 0);
          player.flipX = true;
          if (player.curAnim() !== "walkleft") {
            player.play("walkleft");
            lastDirection = "left";
          }
        }

        if (player.pos.x < WALL_THICKNESS || player.pos.x > WIDTH - WALL_THICKNESS ||
            player.pos.y < WALL_THICKNESS || player.pos.y > HEIGHT - WALL_THICKNESS) {
          k.current.bgColor = [15, 56, 15];
        } else {
          k.current.bgColor = [0, 0, 0];
        }

        if (!isMoving) {
          if (player.curAnim() === "walkright") player.play("stopright");
          else if (player.curAnim() === "walkleft") player.play("stopleft");
          else if (player.curAnim() === "walkup") player.play("stopup");
          else if (player.curAnim() === "walkdown") player.play("stopdown");
        }
      });

      player.onKeyPress("h", () => { if (!showSudoku) player.hurt(1); });
      player.onHurt(() => k.current.debug.log("hurt"));
      player.on("death", () => {
        k.current.debug.log("death");
        k.current.destroy(player);
      });
      player.onKeyPress("space", () => console.log(k.current.width()));

      const enemy = k.current.add([
        k.current.sprite("enemy", { anim: "idle" }),
        k.current.scale(3),
        k.current.area({ scale: 0.3 }),
        k.current.pos(WIDTH / 2, 20),
        k.current.body({ isStatic: true }),
        k.current.anchor("center"),
        "enemy",
        k.current.layer("obj"),
      ]);

      enemy.onCollide("player", () => setShowSudoku(true));

      k.current.camPos(WIDTH / 2, HEIGHT / 2);
      k.current.layers(["bg", "obj", "ui"], "obj");
    });

    k.current.go("game", 1);
    k.current.play("bg", { volume: 0.5, loop: true });

    const resizeCanvas = () => {
      if (canvasRef.current) {
        const scaleX = window.innerWidth / BASE_WIDTH;
        const scaleY = window.innerHeight / BASE_HEIGHT;
        const scale = Math.min(scaleX, scaleY);
        canvasRef.current.style.width = `${BASE_WIDTH * scale}px`;
        canvasRef.current.style.height = `${BASE_HEIGHT * scale}px`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      // Avoid window.location.reload() as it restarts the app unnecessarily
    };
  }, []); // Empty dependency array for one-time initialization

  const handleSudokuComplete = (won) => {
    setShowSudoku(false);
    if (!kRef.current) return;
    if (won) {
      alert("Sudoku solved!");
      const enemies = kRef.current.get("enemy");
      enemies.forEach(enemy => kRef.current.destroy(enemy));
    } else {
      alert("Sudoku failed!");
      const player = kRef.current.get("player")[0];
      if (player) player.hurt(1);
    }
    if (canvasRef.current) canvasRef.current.focus();
  };

  return (
    <div className="game-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#0f380f',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <canvas
        id="gameCanvas"
        width={160}
        height={144}
        ref={canvasRef}
        tabIndex={0}
        style={{ imageRendering: 'pixelated' }}
      />
      {showSudoku && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}>
          <div style={{ background: '#fff', padding: '10px' }}>
            <SudokuGame onComplete={handleSudokuComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;