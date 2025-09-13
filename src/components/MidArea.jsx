import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import dustbin from '../assets/icons/whitebin.png'
const BlockInput = ({ type, value, onChange }) => (
  <input
    type={type}
    className="w-12 text-black text-center rounded mx-1"
    value={value}
    onChange={onChange}
    onClick={(e) => e.stopPropagation()} 
  />
);

export default function MidArea({ sprite, updateScript }) {
  const { setNodeRef } = useDroppable({ id: 'mid-area' });

  const handleInputChange = (blockId, field, value) => {
    const parsedValue =
      value === "" ? "" : isNaN(Number(value)) ? value : Number(value);

    const newScript = sprite.script.map((block) =>
      block.id === blockId
        ? { ...block, values: { ...block.values, [field]: parsedValue } }
        : block
    );
    updateScript(sprite.id, newScript);
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case 'MOVE':
        return (
          <>
            Move
            <BlockInput
              type="number"
              value={block.values.steps ?? 10}
              onChange={(e) =>
                handleInputChange(block.id, 'steps', e.target.value)
              }
            />
            steps
          </>
        );
      case 'TURN_RIGHT':
        return (
          <>
            Turn ↻
            <BlockInput
              type="number"
              value={block.values.degrees ?? 15}
              onChange={(e) =>
                handleInputChange(block.id, 'degrees', e.target.value)
              }
            />
            degrees
          </>
        );
      case 'GOTO':
        return (
          <>
            Go to x:
            <BlockInput
              type="number"
              value={block.values.x ?? 0}
              onChange={(e) =>
                handleInputChange(block.id, 'x', e.target.value)
              }
            />
            y:
            <BlockInput
              type="number"
              value={block.values.y ?? 0}
              onChange={(e) =>
                handleInputChange(block.id, 'y', e.target.value)
              }
            />
          </>
        );
      case 'SAY':
        return (
          <>
            Say
            <BlockInput
              type="text"
              value={block.values.text ?? 'Hello!'}
              onChange={(e) =>
                handleInputChange(block.id, 'text', e.target.value)
              }
            />
            for
            <BlockInput
              type="number"
              value={block.values.seconds ?? 2}
              onChange={(e) =>
                handleInputChange(block.id, 'seconds', e.target.value)
              }
            />
            secs
          </>
        );
      case 'THINK':
        return (
          <>
            Think
            <BlockInput
              type="text"
              value={block.values.text ?? 'Hmm...'}
              onChange={(e) =>
                handleInputChange(block.id, 'text', e.target.value)
              }
            />
            for
            <BlockInput
              type="number"
              value={block.values.seconds ?? 2}
              onChange={(e) =>
                handleInputChange(block.id, 'seconds', e.target.value)
              }
            />
            secs
          </>
        );
      case 'REPEAT':
        return (
          <>
            Repeat
            <BlockInput
              type="number"
              value={block.values.times ?? 10}
              onChange={(e) =>
                handleInputChange(block.id, 'times', e.target.value)
              }
            />
          </>
        );
      default:
        return block.type;
    }
  };
  const handleDeleteBlock = (blockId) => {
    const newScript = sprite.script.filter(b => b.id !== blockId);
    updateScript(sprite.id, newScript);
  };

  return (
    <div ref={setNodeRef} className="flex-1 h-full overflow-auto bg-[#ede9fe] p-4">
      <h2 className="font-bold text-purple-500 text-lg mb-4">Script for {sprite?.id}</h2>
      <div className="p-2 bg-white border border-dashed border-purple-500 h-4/5 rounded">
        {sprite?.script.map((block) => (
          <div
            key={block.id}
            className="p-2 my-1 text-white text-sm rounded cursor-pointer bg-blue-500 w-fit flex items-center gap-2"
          >
            {renderBlock(block)}
            <button
              onClick={() => handleDeleteBlock(block.id)}
              className=" px-2 rounded text-xs ml-2"
            >
            <img src={dustbin} alt="" />
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
