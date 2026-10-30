"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X, Leaf, LoaderCircle } from "lucide-react";
import { useUI } from "@/store/ui";
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    return () => {
      d?.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal-head">
        <div>
          <span className="eyebrow">A LITTLE KITCHEN MAGIC</span>
          <h2 id="modal-title">{title}</h2>
        </div>
        <button
          className="icon-button"
          onClick={close}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <Leaf size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
export function Loading() {
  return (
    <div className="empty" role="status">
      <LoaderCircle className="spin" />
      <p>Opening the kingdom gates…</p>
    </div>
  );
}
export function Toast() {
  const { toast, dismiss } = useUI();
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);
  return toast ? (
    <div className="toast" role="status">
      <Leaf size={18} />
      <span>{toast}</span>
      <button aria-label="Dismiss notification" onClick={dismiss}>
        <X size={16} />
      </button>
    </div>
  ) : null;
}
