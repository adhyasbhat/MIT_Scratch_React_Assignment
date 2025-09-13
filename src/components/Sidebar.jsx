import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableBlock = ({ id, text, color }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-2 my-2 text-white text-sm rounded cursor-pointer ${color}`}
    >
      {text}
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full bg-white overflow-y-auto p-4 border-r border-gray-200">
      <h2 className="font-bold text-purple-500 text-lg mb-4">Blocks</h2>

      <div className="font-semibold text-violet-500">Motion</div>
      <DraggableBlock id="MOVE" text="Move 10 steps" color="bg-blue-500" />
      <DraggableBlock id="TURN_RIGHT" text="Turn ↻ 15 degrees" color="bg-blue-500" />
      <DraggableBlock id="GOTO" text="Go to x:0 y:0" color="bg-blue-500" />

      <div className="font-semibold text-violet-500 mt-4">Looks</div>
      <DraggableBlock id="SAY" text="Say Hello! for 2 secs" color="bg-purple-500" />
      <DraggableBlock id="THINK" text="Think Hmm... for 2 secs" color="bg-purple-500" />
      
      <div className="font-semibold text-violet-500 mt-4">Controls</div>
      <DraggableBlock id="REPEAT" text="Repeat 10" color="bg-yellow-500" />
    </div>
  );
}