import React, { useState, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';
import bunny from '../src/assets/icons/bunny.png';
import cat from '../src/assets/icons/cat.png'
import dog from '../src/assets/icons/dog.png';
import fish from '../src/assets/icons/fish.png';
import lion from '../src/assets/icons/lion.png';
import monkey from '../src/assets/icons/monkey.png';
import parrots from '../src/assets/icons/parrots.png';
import rain from '../src/assets/icons/rain.png';
import snake from '../src/assets/icons/snake.png';
import tiger from '../src/assets/icons/tiger.png';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const spriteIcons = [bunny, cat, dog, fish, lion, monkey, parrots, rain, snake, tiger];

export default function App() {
  const [sprites, setSprites] = useState([
    {
      id: 'sprite1',
      x: 0,
      y: 0,
      angle: 0,
      script: [],
      message: null,
      think: false,
      showMessage: false,
      icon: spriteIcons[0]
    }
  ]);
  const [activeSpriteId, setActiveSpriteId] = useState('sprite1');
  const spriteRefs = useRef({});

  // Handler for dropping blocks into MidArea (ONLY for blocks)
  const handleBlockDrop = (event) => {
    const { over, active } = event;
    // Ensure the draggable is a block from the sidebar, not a sprite
    if (over && over.id === 'mid-area' && active.id.startsWith('MOVE') || active.id.startsWith('TURN') || active.id.startsWith('GOTO') || active.id.startsWith('SAY') || active.id.startsWith('THINK') || active.id.startsWith('REPEAT')) {
      const blockType = active.id;
      const newBlock = { id: uuidv4(), type: blockType, values: {} };

      setSprites(prevSprites => prevSprites.map(sprite =>
        sprite.id === activeSpriteId ? { ...sprite, script: [...sprite.script, newBlock] } : sprite
      ));
    }
  };

  // Handler for dragging sprites inside the stage (ONLY for sprites)
  const handleSpriteDragEnd = (event) => {
    const { active, delta } = event;
    // Check if the dragged item is a sprite
    if (sprites.some(s => s.id === active.id)) {
      setSprites(prevSprites =>
        prevSprites.map(sprite =>
          sprite.id === active.id
            ? { ...sprite, x: sprite.x + delta.x, y: sprite.y + delta.y }
            : sprite
        )
      );
    }
  };

  const updateScript = (spriteId, newScript) => {
    setSprites(prev => prev.map(s => s.id === spriteId ? { ...s, script: newScript } : s));
  };

  const addSprite = () => {
    const newSpriteId = `sprite${sprites.length + 1}`;
    const randomIcon = spriteIcons[Math.floor(Math.random() * spriteIcons.length)];

    setSprites(prev => [
      ...prev,
      {
        id: newSpriteId,
        x: 50,
        y: 50,
        angle: 0,
        script: [],
        message: null,
        think: false,
        showMessage: false,
        icon: randomIcon
      }
    ]);
    setActiveSpriteId(newSpriteId);
  };
  const deleteSprite = (spriteId) => {
    // Calculate the new state first
    const newSprites = sprites.filter(s => s.id !== spriteId);
    setSprites(newSprites);

    // Check if the deleted sprite was the active one
    if (activeSpriteId === spriteId) {
      if (newSprites.length > 0) {
        // If other sprites remain, make the first one active
        setActiveSpriteId(newSprites[0].id);
      } else {
        // If no sprites are left, clear the active ID
        setActiveSpriteId(null);
      }
    }
  };
  const checkCollisionAndSwap = (spriteA, spriteB) => {
    const a = spriteRefs.current[spriteA.id]?.getBoundingClientRect();
    const b = spriteRefs.current[spriteB.id]?.getBoundingClientRect();
    if (!a || !b) return;

    // AABB collision detection
    if (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    ) {
      console.log(`Collision detected between ${spriteA.id} and ${spriteB.id}!`);

      // Swap the entire script arrays
      const scriptA = [...spriteA.script];
      const scriptB = [...spriteB.script];

      setSprites(prev =>
        prev.map(s => {
          if (s.id === spriteA.id) return { ...s, script: scriptB };
          if (s.id === spriteB.id) return { ...s, script: scriptA };
          return s;
        })
      );
    }
  };


  const runScript = async (sprite) => {
    let i = 0;

    while (i < (sprites.find(s => s.id === sprite.id)?.script.length || 0)) {
      const currentSpriteState = sprites.find(s => s.id === sprite.id);
      if (!currentSpriteState) break;

      const block = currentSpriteState.script[i];
      let blockToExecute = block;
      let repeatCount = 1;

      if (block.type === "REPEAT") {
        repeatCount = block.values.times || 10;
        const nextBlock = currentSpriteState.script[i + 1];
        if (nextBlock) {
          blockToExecute = nextBlock;
          i++;
        } else {
          i++;
          continue;
        }
      }

      for (let j = 0; j < repeatCount; j++) {
        const freshSpriteState = sprites.find(s => s.id === sprite.id);
        await executeBlock(freshSpriteState, blockToExecute);

        for (const otherSprite of sprites) {
          if (sprite.id !== otherSprite.id) {
            const updatedSprite = sprites.find(s => s.id === sprite.id);
            const updatedOtherSprite = sprites.find(s => s.id === otherSprite.id);
            if (updatedSprite && updatedOtherSprite) {
              checkCollisionAndSwap(updatedSprite, updatedOtherSprite);
            }
          }
        }
      }

      i++;
    }
  };


  const executeBlock = async (sprite, block) => {
    if (!block) return;
    let updatedSprite = { ...sprite };

    switch (block.type) {
      case 'MOVE':
        const steps = block.values.steps || 10;
        const radians = (sprite.angle * Math.PI) / 180;
        updatedSprite.x += steps * Math.cos(radians);
        updatedSprite.y += steps * Math.sin(radians);
        break;
      case 'TURN_RIGHT':
        updatedSprite.angle += block.values.degrees || 15;
        break;
      case 'GOTO':
        updatedSprite.x = block.values.x || 0;
        updatedSprite.y = block.values.y || 0;
        break;
      case 'SAY':
        updatedSprite = { ...updatedSprite, message: block.values.text || "Hello!", think: false, showMessage: true };
        break;
      case 'THINK':
        updatedSprite = { ...updatedSprite, message: block.values.text || "Hmm...", think: true, showMessage: true };
        break;
    }

    setSprites(prev => prev.map(s => s.id === sprite.id ? updatedSprite : s));

    if (block.type === 'SAY' || block.type === 'THINK') {
      const duration = (block.values.seconds || 2) * 1000;
      await sleep(duration);
      setSprites(prev => prev.map(s => s.id === sprite.id ? { ...s, showMessage: false } : s));
    } else {
      await sleep(100); // Small delay for move/turn animations
    }
  };

  const handlePlay = () => {
    sprites.forEach(sprite => runScript(sprite));
  };

  const activeSprite = sprites.find(s => s.id === activeSpriteId);

  return (
    <div className="bg-blue-100 font-sans h-screen overflow-hidden">
      <div className="h-full">
        <div className='h-16 bg-purple-500 w-full text-4xl text-white p-2 text-center font-semibold'>Sprite MIT</div>
        <div className='flex h-full'>
          {/* DndContext for Blocks */}
          <DndContext onDragEnd={handleBlockDrop}>
            <Sidebar />
            <MidArea
              sprite={activeSprite}
              updateScript={updateScript}
            />
          </DndContext>

          {/* DndContext for Sprites */}
          <DndContext onDragEnd={handleSpriteDragEnd}>
            <PreviewArea
              sprites={sprites}
              spriteRefs={spriteRefs}
              addSprite={addSprite}
              activeSpriteId={activeSpriteId}
              setActiveSpriteId={setActiveSpriteId}
              onPlay={handlePlay}
              deleteSprite={deleteSprite}
            />
          </DndContext>
        </div>
      </div>
    </div>
  );
}