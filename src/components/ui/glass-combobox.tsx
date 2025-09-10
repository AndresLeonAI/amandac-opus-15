"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface GlassComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helpText?: string;
  tooltip?: string;
  footerText?: string;
  errorMessage?: string;
  className?: string;
}

export const GlassCombobox: React.FC<GlassComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción",
  label,
  helpText,
  tooltip,
  footerText,
  errorMessage,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value);
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFocusedIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label className="block font-elegant text-sm text-muted-foreground">
            {label}
          </label>
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-card/90 backdrop-blur-md border border-border/30 rounded-lg shadow-2xl z-50"
                  >
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {tooltip}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-card/90 border-r border-b border-border/30 rotate-45"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          {helpText}
        </p>
      )}

      {/* Combobox Container */}
      <div className="relative">
        {/* Glass Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border border-border/30 rounded-lg shadow-elegant" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg" />
        
        {/* Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchQuery : (selectedOption?.label || '')}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-transparent border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-elegant placeholder:text-muted-foreground/60 relative z-10"
            aria-label={label}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          
          {/* Search Icon */}
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-20">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          
          {/* Chevron */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 p-1 hover:bg-primary/10 rounded transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-auto z-50"
            >
              {/* Glass Dropdown Background */}
              <div className="bg-card/90 backdrop-blur-xl border border-border/30 rounded-lg shadow-2xl">
                <div className="py-2">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`w-full px-4 py-3 text-left text-sm font-elegant transition-all duration-200 ${
                          index === focusedIndex
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-primary/5'
                        } ${
                          option.value === value
                            ? 'bg-primary/10 text-primary font-medium'
                            : ''
                        }`}
                        role="option"
                        aria-selected={option.value === value}
                      >
                        {option.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground font-elegant">
                      No se encontraron opciones
                    </div>
                  )}
                </div>
                
                {/* Footer Text */}
                {footerText && (
                  <div className="border-t border-border/20 px-4 py-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {footerText}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-destructive font-elegant"
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
};