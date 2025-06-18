import { useEffect, useRef, useState, useCallback } from 'react';

const POLL_INTERVAL = 1000; // Check for file changes every second
const DEBOUNCE_DELAY = 300;

export function useFileSync(onFileChange) {
  const [syncStatus, setSyncStatus] = useState({ type: null, message: '' });
  const [isEnabled, setIsEnabled] = useState(true);
  const lastContentRef = useRef('');
  const pollIntervalRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isWritingRef = useRef(false);

  // Read pattern from server
  const readPattern = useCallback(async () => {
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/pattern?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to read pattern');
      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Error reading pattern:', error);
      return null;
    }
  }, []);

  // Write pattern to server
  const writePattern = useCallback(async (content) => {
    if (!isEnabled) return false;
    
    try {
      isWritingRef.current = true;
      lastContentRef.current = content;
      
      const response = await fetch('/api/pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) throw new Error('Failed to write pattern');
      
      setSyncStatus({ type: 'success', message: 'Pattern saved to file' });
      setTimeout(() => setSyncStatus({ type: null, message: '' }), 2000);
      
      return true;
    } catch (error) {
      console.error('Error writing pattern:', error);
      setSyncStatus({ type: 'error', message: 'Failed to save pattern' });
      setTimeout(() => setSyncStatus({ type: null, message: '' }), 2000);
      return false;
    } finally {
      // Reset writing flag after a delay to avoid race conditions
      setTimeout(() => {
        isWritingRef.current = false;
      }, 500);
    }
  }, [isEnabled]);

  // Check for external file changes
  const checkForChanges = useCallback(async () => {
    if (isWritingRef.current) return;
    
    const content = await readPattern();
    if (content === null) return;
    
    // Only trigger if content actually changed
    if (content !== lastContentRef.current) {
      console.log('[FileSync] External change detected');
      lastContentRef.current = content;
      
      // Debounce the callback
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (onFileChange) {
          console.log('[FileSync] Loading external changes');
          onFileChange(content);
          setSyncStatus({ type: 'info', message: 'Pattern loaded from file' });
          setTimeout(() => setSyncStatus({ type: null, message: '' }), 2000);
        }
      }, DEBOUNCE_DELAY);
    }
  }, [onFileChange, readPattern]);

  // Start polling for changes
  useEffect(() => {
    if (!isEnabled) return;

    console.log('[FileSync] Starting file polling');
    // Initial check
    checkForChanges();
    
    // Start polling
    pollIntervalRef.current = setInterval(checkForChanges, POLL_INTERVAL);

    return () => {
      console.log('[FileSync] Stopping file polling');
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      clearTimeout(debounceTimerRef.current);
    };
  }, [isEnabled, checkForChanges]);

  // Initial load
  const loadInitialContent = useCallback(async () => {
    const content = await readPattern();
    if (content) {
      lastContentRef.current = content;
    }
    return content;
  }, [readPattern]);

  return {
    writePattern,
    readPattern,
    loadInitialContent,
    syncStatus,
    isEnabled,
    setIsEnabled,
  };
}