import React, { useMemo } from 'react';
import { IconData, Role, IconConfig } from '../types';
import { processSvgContent } from '../services/svgUtils';
import { Check } from 'lucide-react';

interface IconCardProps {
  icon: IconData;
  role: Role;
  config: IconConfig;
  isSelected: boolean;
  onToggleSelect: (id: string, shiftKey: boolean) => void;
  onClick?: () => void;
}

const IconCard: React.FC<IconCardProps> = ({
  icon,
  role,
  config,
  isSelected,
  onToggleSelect,
  onClick
}) => {
  // Memoize the processed SVG to avoid regex overhead on every render unless config changes
  const displaySvg = useMemo(() => {
    return processSvgContent(icon.content, config, icon.type);
  }, [icon.content, config, icon.type]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role === 'designer') {
      onToggleSelect(icon.id, e.shiftKey);
    } else {
      onClick && onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
        ${isSelected && role === 'designer'
          ? 'border-black ring-2 ring-black ring-offset-2 bg-gray-50'
          : 'border-gray-100 hover:border-gray-300 hover:shadow-card hover:-translate-y-1'
        }
      `}
      style={{ aspectRatio: '1/1' }}
    >
      {/* Checkbox for Designer */}
      {role === 'designer' && (
        <div className={`absolute top-3 left-3 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
          ${isSelected 
            ? 'bg-black border-black scale-100' 
            : 'border-gray-300 bg-white opacity-0 group-hover:opacity-100 hover:border-black'}`}>
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
      )}

      {/* Badge for Type (Line/Solid) - Optional helper */}
      {role === 'designer' && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
              {icon.type}
          </div>
      )}

      {/* Icon Content */}
      <div 
        className="text-gray-800 transition-all duration-300 transform group-hover:scale-110"
        dangerouslySetInnerHTML={{ __html: displaySvg }} 
      />
      
      {/* Icon Name */}
      <div className="mt-4 text-[11px] font-medium text-gray-400 truncate max-w-full px-2 text-center group-hover:text-black transition-colors">
        {icon.name}
      </div>
      
      {/* User Click Hint */}
      {role === 'user' && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors rounded-2xl" />
      )}
    </div>
  );
};

export default IconCard;