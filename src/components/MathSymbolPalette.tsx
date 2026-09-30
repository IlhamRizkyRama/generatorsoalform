import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sigma } from 'lucide-react';

interface MathSymbolPaletteProps {
  onInsertSymbol: (symbol: string) => void;
}

const SYMBOL_CATEGORIES = [
  {
    name: 'Aritmatika & Aljabar',
    symbols: ['±', '×', '÷', '≠', '≈', '≤', '≥', '√', '²', '³', '½', '¼', '¾', '°', 'π', '∞', '∑', '∫', 'Δ'],
  },
  {
    name: 'Logika & Koding',
    symbols: ['←', '→', '↔', '⇒', '⇔', '∧', '∨', '¬', '⊕', '==', '!=', '<=', '>=', '&&', '||', '%', 'mod'],
  },
  {
    name: 'Simbol Yunani & Himpunan',
    symbols: ['α', 'β', 'γ', 'θ', 'λ', 'μ', 'π', 'σ', 'ω', '∈', '∉', '⊂', '⊆', '∪', '∩', '∅'],
  },
];

export const MathSymbolPalette: React.FC<MathSymbolPaletteProps> = ({ onInsertSymbol }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="border border-indigo-100 rounded-xl bg-indigo-50/40 p-2 text-xs">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <Sigma className="w-3.5 h-3.5 text-indigo-600" />
          <span>Simbol Matematika & Logika Koding</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] text-slate-400">Klik simbol untuk menyisipkan ke kursor</span>
      </div>

      {isOpen && (
        <div className="mt-2.5 pt-2 border-t border-indigo-100 space-y-2">
          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {SYMBOL_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  activeCategory === idx
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Symbol Buttons Grid */}
          <div className="flex flex-wrap gap-1 bg-white p-2 rounded-lg border border-indigo-100">
            {SYMBOL_CATEGORIES[activeCategory].symbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => onInsertSymbol(sym)}
                className="w-7 h-7 flex items-center justify-center font-mono font-bold text-sm bg-slate-50 hover:bg-indigo-100 hover:text-indigo-700 text-slate-800 rounded border border-slate-200 transition-colors"
                title={`Sisipkan ${sym}`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
