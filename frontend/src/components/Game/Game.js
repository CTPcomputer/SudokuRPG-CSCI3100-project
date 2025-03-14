import React, { useEffect, useState, useRef } from 'react';
import kaplay from "kaplay";
import "./Game.css";
import SudokuGame from '../SudokuGame';
import { defineStage1Scene } from './Gamecomponent/stage1';
import { defineStage2Scene } from './Gamecomponent/stage2';
import { defineStage3Scene } from './Gamecomponent/stage3';
import { defineStage4Scene } from './Gamecomponent/stage4';
import { defineWinScene } from './Gamecomponent/win'; // Import the win scene
import {useNavigate} from 'react-router-dom';

const Game = () => {
  const navigate = useNavigate();
  const [showSudoku, setShowSudoku] = useState(false);
  const kRef = useRef(null);
  const canvasRef = useRef(null);
  const k = useRef(null);
  const stagenum = useRef(1);

  useEffect(() => {
    const BASE_WIDTH = 160;
    const BASE_HEIGHT = 144;
    const WALL_THICKNESS = 8;
    const WIDTH = BASE_WIDTH;
    const HEIGHT = BASE_HEIGHT;

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

    // Define layers globally ONCE during initialization
    k.current.layers(["bg", "obj", "ui"], "obj");

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
        idie: { from: 0, to: 0, loop: true },
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

    const player = k.current.make([
      k.current.sprite("prototype", { frame: 0 }),
      k.current.scale(2),
      k.current.pos(BASE_WIDTH / 2, BASE_HEIGHT / 2),
      k.current.health(4),
      k.current.area({ scale: 0.5 }),
      k.current.body(),
      k.current.anchor("center"),
      "player",
      k.current.layer("obj"),
    ]);

    let lastDirection = "right";
          
    player.onUpdate(() => {
      // Use k.current.isKeyDown instead of accessing showSudoku directly
      // Since we're in a closure, we can't directly access React state here
      // However, we can rely on the fact that setShowSudoku will pause gameplay
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
    
      if (
        player.pos.x < WALL_THICKNESS ||
        player.pos.x > WIDTH - WALL_THICKNESS ||
        player.pos.y < WALL_THICKNESS ||
        player.pos.y > HEIGHT - WALL_THICKNESS
      ) {
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
    
    player.onKeyPress("h", () => {
      player.hurt(1);
    });
    player.onHurt(() => k.current.debug.log("hurt"));
    player.on("death", () => {
      k.current.debug.log("death");
      k.current.destroy(player);
    });
    player.onKeyPress("space", () => k.current.debug.log(k.current.width()));
  


    // Define scenes by calling the imported functions
    defineStage1Scene(k.current, setShowSudoku,BASE_WIDTH,BASE_HEIGHT,player);
    defineStage2Scene(k.current, setShowSudoku,BASE_WIDTH,BASE_HEIGHT,player);
    defineStage3Scene(k.current, setShowSudoku,BASE_WIDTH,BASE_HEIGHT,player); 
    defineStage4Scene(k.current, setShowSudoku,BASE_HEIGHT,BASE_HEIGHT,player);
    defineWinScene(k.current, setShowSudoku); // Define "win" scene


    // Start the game
    k.current.go("stage1", 1);
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
      window.location.reload();
    };
  }, []);

  window.onbeforeunload = function () {navigate('/');}

  const handleSudokuComplete = (won) => {
    setShowSudoku(false);
    if (!kRef.current) return;

    if (won) {
      const enemies = kRef.current.get("enemy");
      enemies.forEach(enemy => kRef.current.destroy(enemy));
      kRef.current.go("win");
    } else {
      alert("Sudoku failed!");
      const player = kRef.current.get("player")[0];
      if (player) player.hurt(1);
    }

    if (canvasRef.current) canvasRef.current.focus();
  };

  const stagelist = ["stage1", "stage2", "stage3", "stage4", "win"];
  const tonextstage = () => {
    const currentStage = kRef.current.getSceneName();
    console.log(currentStage);
    const currentIndex = stagelist.indexOf(currentStage);
    if (currentIndex === stagelist.length - 1) {
      kRef.current.go("win");
    } else {
      setShowSudoku(false);
      if (canvasRef.current) {
        canvasRef.current.focus();
    }
      stagenum.current += 1;
      kRef.current.go(stagelist[currentIndex + 1], stagenum.current);
    }
  }

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
        width={800}
        height={600}
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
          <button onClick={tonextstage} style={{
              position: 'absolute',
              top: '5%',
            }}>Test next stagae</button>
            <SudokuGame onComplete={handleSudokuComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;