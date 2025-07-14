// Terminal.jsx
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const term = useRef(null);

  useEffect(() => {
    term.current = new Terminal();
    term.current.open(terminalRef.current);
    term.current.write('Welcome to the Terminal\r\n');

    // Connect to backend process
    window.electronAPI.onTerminalData((data) => {
      term.current.write(data);
    });

    term.current.onData((input) => {
      window.electronAPI.sendTerminalData(input);
    });

    return () => term.current.dispose();
  }, []);

  return <div ref={terminalRef} style={{ height: '300px', width: '100%' }} />;
};

export default TerminalComponent;
