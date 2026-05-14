import React, { useState } from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  masked?: boolean
}

export function Input({ label, error, masked, className, type, ...rest }: InputProps) {
  const [show, setShow] = useState(false)
  const inputType = masked ? (show ? 'text' : 'password') : type

  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        <input
          className={`${styles.input} ${error ? styles.hasError : ''} ${className ?? ''}`}
          type={inputType}
          {...rest}
        />
        {masked && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShow(s => !s)}
            tabIndex={-1}
          >
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, className, ...rest }: TextAreaProps) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={`${styles.input} ${styles.textarea} ${error ? styles.hasError : ''} ${className ?? ''}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
