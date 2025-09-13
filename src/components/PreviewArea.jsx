import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import dustbin from '../assets/icons/delete.png'
import play from '../assets/icons/play.png'
const Sprite = React.forwardRef(({ sprite }, ref) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: sprite.id,
  });

  const { x, y, angle, message, think, showMessage, icon } = sprite;

  const style = {
    transform: transform
      ? `translate(${x + transform.x}px, ${y + transform.y}px) rotate(${angle}deg)`
      : `translate(${x}px, ${y}px) rotate(${angle}deg)`
  };

  const speechBubbleClass = think
    ? "rounded-full border-gray-400"
    : "rounded-lg border-gray-400";



  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (ref) ref(node);
      }}
      {...listeners}
      {...attributes}
      className="absolute"
      style={style}
    >
      {showMessage && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white border ${speechBubbleClass}`}>
          {message}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
        </div>
      )}
      <div className="text-5xl cursor-pointer"><img src={icon} className='h-10' /></div>
    </div>
  );
});

export default function PreviewArea({ sprites, spriteRefs, addSprite, setActiveSpriteId, onPlay ,deleteSprite,activeSpriteId}) {
  
  return (
    <div className="w-1/3 h-full p-4 bg-white">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="font-bold text-purple-500 text-lg mb-4">Stage</h2>
        <div className="flex items-center gap-2">
          <button onClick={onPlay} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1 mr-2">
            <img className='h-4' src={play} alt="" />
            Play
          </button>
          <button onClick={addSprite} className="bg-blue-500 text-white px-4 py-2 rounded">Add Sprite</button>
        </div>
      </div>

      <div className="relative w-full h-1/2 bg-white border p-2 border-purple-500 rounded overflow-hidden">
        {sprites.map((sprite) => (
          <Sprite
            key={sprite.id}
            sprite={sprite}
            ref={(el) => (spriteRefs.current[sprite.id] = el)}
          />
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-purple-500 text-lg mb-4">Sprites List</h3>
        <div className="flex gap-2 bg-purple-100 h-32 p-2 overflow-auto flex-wrap">
          <div className="w-full flex flex-col gap-y-2">
            {sprites.map(s => (
              <div
                key={s.id}
                className={`p-2  rounded cursor-pointer w-full flex items-center justify-between gap-2
                  ${s.id === activeSpriteId ? "bg-purple-300" : "bg-white"}`}
                onClick={() => setActiveSpriteId(s.id)}
              >
                <span className="cursor-pointer">
                  {s.id}
                </span>
                <button onClick={(e) => { e.stopPropagation(); deleteSprite(s.id); }}>
                  <img src={dustbin} alt="delete" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
