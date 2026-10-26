import { useState, useRef, useEffect } from 'react';
import { Key, Eye, EyeOff, X, Sparkles } from 'lucide-react';
import styles from './ApiKeyModal.module.css';

interface Props {
  onSave: (key: string) => void;
  currentKey: string;
}

export default function ApiKeyModal({ onSave, currentKey }: Props) {
  const [val, setVal] = useState(currentKey);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const masked = currentKey ? currentKey.slice(0, 8) + '••••••••' + currentKey.slice(-4) : '';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}><Key size={28} /></div>
        <h2>Connect your Gemini API Key</h2>
        <p className={styles.sub}>
          Your key is stored locally in the browser — never sent to any server.
          Get one free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.
        </p>
        {currentKey && (
          <div className={styles.existing}>
            <Sparkles size={14} /> Active key: <code>{masked}</code>
          </div>
        )}
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            type={show ? 'text' : 'password'}
            placeholder="AIza..."
            value={val}
            onChange={e => setVal(e.target.value)}
            className={styles.input}
            onKeyDown={e => { if (e.key === 'Enter' && val.trim()) onSave(val.trim()); }}
          />
          <button className={styles.eye} onClick={() => setShow(s => !s)} title="Toggle visibility">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.save}
            disabled={!val.trim()}
            onClick={() => onSave(val.trim())}
          >
            Save & Continue
          </button>
          {currentKey && (
            <button className={styles.cancel} onClick={() => onSave(currentKey)}>
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
