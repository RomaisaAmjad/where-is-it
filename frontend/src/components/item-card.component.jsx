import React from 'react';
import { Star, Pencil, Trash, Package } from 'tabler-icons-react';

export default function ItemCard({ item, onToggleFavorite, onEdit, onDelete }) {
  const { item_id, item_name, storage_place, room, is_frequently_used } = item;

  return (
    <tr className="border-b border-granny-panel/40 hover:bg-granny-panel/10 transition-smooth group align-middle">
      {/* Favorite / Frequently Used Star */}
      <td className="px-4 py-3 text-center w-14">
        <button
          onClick={() => onToggleFavorite(item)}
          className="focus-visible:ring-2 focus-visible:ring-granny-salmon p-1 rounded-sm transition-smooth hover:scale-110 active:scale-95 focus:outline-none"
          aria-label={is_frequently_used ? `Remove ${item_name} from frequently used` : `Add ${item_name} to frequently used`}
        >
          {is_frequently_used ? (
            <Star className="w-5.5 h-5.5 text-yellow-500" fill="currentColor" />
          ) : (
            <Star className="w-5.5 h-5.5 text-granny-text/40 group-hover:text-granny-text/60" />
          )}
        </button>
      </td>

      {/* Item Name */}
      <td className="px-4 py-3">
        <div className="text-granny-text text-sm md:text-base tracking-wide">
          {item_name}
        </div>
      </td>

      {/* Storage Location */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-2 text-granny-text/80 text-sm">
          <Package className="w-5 h-5 text-granny-teal shrink-0" />
          <span className="break-all">{storage_place || 'Not specified'}</span>
        </div>
      </td>

      {/* Room Name */}
      <td className="px-4 py-3 w-36 text-center">
        {room ? (
          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-granny-accent/30 text-granny-text border border-granny-accent/50">
            {room}
          </span>
        ) : (
          <span className="text-granny-text/40 text-xs italic">No Room</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 w-24 text-right">
        <div className="flex justify-end items-center gap-1.5">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-granny-text/50 hover:text-granny-teal hover:bg-granny-teal/10 rounded-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-teal"
            aria-label={`Edit ${item_name}`}
          >
            <Pencil className="w-5 h-5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item_id)}
            className="p-2 text-granny-text/50 hover:text-granny-salmon hover:bg-granny-salmon/10 rounded-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon"
            aria-label={`Delete ${item_name}`}
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
