"use client";

import { useState, useEffect } from "react";
import { soundManager } from "../lib/sound-effects";

interface GameSettingsProps {
  onClose: () => void;
}

export function GameSettings({ onClose }: GameSettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    // Load current settings
    setSoundEnabled(soundManager.isSoundEnabled());
    setSoundVolume(soundManager.getVolume());
    
    // Load other settings from localStorage
    const haptic = localStorage.getItem('scrabble_haptic_enabled');
    const animations = localStorage.getItem('scrabble_animations_enabled');
    const hints = localStorage.getItem('scrabble_show_hints');
    
    if (haptic !== null) setHapticEnabled(haptic === 'true');
    if (animations !== null) setAnimationsEnabled(animations === 'true');
    if (hints !== null) setShowHints(hints === 'true');
  }, []);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setEnabled(enabled);
    if (enabled) {
      soundManager.initialize();
      soundManager.playButtonClick();
    }
  };

  const handleVolumeChange = (volume: number) => {
    setSoundVolume(volume);
    soundManager.setVolume(volume);
    soundManager.playButtonClick();
  };

  const handleHapticToggle = (enabled: boolean) => {
    setHapticEnabled(enabled);
    localStorage.setItem('scrabble_haptic_enabled', enabled.toString());
    
    // Trigger haptic feedback if available
    if (enabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    setAnimationsEnabled(enabled);
    localStorage.setItem('scrabble_animations_enabled', enabled.toString());
  };

  const handleHintsToggle = (enabled: boolean) => {
    setShowHints(enabled);
    localStorage.setItem('scrabble_show_hints', enabled.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Game Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Sound Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Sound</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sound Effects</span>
                <button
                  onClick={() => handleSoundToggle(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {soundEnabled && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Volume</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={soundVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Haptic Feedback */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Haptic Feedback</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Vibration</span>
              <button
                onClick={() => handleHapticToggle(!hapticEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hapticEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Visual Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Visual</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Animations</span>
                <button
                  onClick={() => handleAnimationsToggle(!animationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    animationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show Hints</span>
                <button
                  onClick={() => handleHintsToggle(!showHints)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showHints ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showHints ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Accessibility</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Use Tab to navigate between elements</p>
              <p>• Space/Enter to activate buttons</p>
              <p>• Arrow keys to move between tiles</p>
              <p>• Escape to close modals</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
