import React from 'react';

const SlotCard = ({ slot, onSelect, isSelected }) => {
  const getSlotTypeColor = (type) => {
    switch (type) {
      case 'car':
        return 'bg-blue-100 text-blue-800';
      case 'bike':
        return 'bg-green-100 text-green-800';
      case 'ev':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSlotStatusColor = () => {
    if (!slot.is_active) {
      return 'bg-gray-300 border-gray-400 cursor-not-allowed';
    }
    if (!slot.is_available) {
      return 'bg-red-100 border-red-300 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-primary-100 border-primary-500 border-2';
    }
    return 'bg-white border-gray-300 hover:border-primary-400 cursor-pointer';
  };

  const handleClick = () => {
    if (slot.is_active && slot.is_available && onSelect) {
      onSelect(slot);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-lg border-2 transition-all ${getSlotStatusColor()}`}
    >
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-2">
          {slot.slot_type === 'car' ? '🚗' : slot.slot_type === 'bike' ? '🏍️' : '⚡'}
        </div>
        <div className="font-bold text-lg">{slot.slot_code}</div>
        <div className={`text-xs px-2 py-1 rounded mt-2 ${getSlotTypeColor(slot.slot_type)}`}>
          {slot.slot_type.toUpperCase()}
        </div>
        <div className="mt-2 text-sm">
          {!slot.is_active ? (
            <span className="text-gray-500">Inactive</span>
          ) : slot.is_available ? (
            <span className="text-green-600 font-medium">Available</span>
          ) : (
            <span className="text-red-600 font-medium">Booked</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotCard;
