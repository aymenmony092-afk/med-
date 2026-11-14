import React, { useState } from 'react';
import { BookOpen, Send, Loader2 } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; text: string };
type Props = { document: { name: string; mimeType: string; blob: Blob } | undefined };

export const DocumentDiscussionPanel: React.FC<Props> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!document || !input.trim() || loading) return;
    const next = [...messages, { role: 'user' as const, text: input.trim() }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
        reader.readAsDataURL(document.blob);
      });
      const response = await fetch('/api/ai/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: document.name,
          mimeType: document.mimeType,
          fileBase64: dataUrl.split(',')[1] || '',
          messages: next.slice(-10),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Discussion indisponible.');
      setMessages((current) => [...current, { role: 'assistant', text: result.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de discussion.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
    <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><h2 className="font-semibold text-slate-900 dark:text-slate-100">Discuter avec mon document</h2></div>
    <p className="text-sm text-slate-600 dark:text-slate-300">Posez vos questions sur le fichier sélectionné. Gemini privilégie le document et signale les compléments externes.</p>
    <div className="max-h-80 min-h-24 space-y-3 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
      {!document && <p className="text-sm text-slate-500">Sélectionnez d’abord un document dans votre bibliothèque.</p>}
      {document && !messages.length && <p className="text-sm text-slate-500">Exemples : explique ce chapitre, compare deux mécanismes, résume cette section.</p>}
      {messages.map((message, index) => <div key={index} className={message.role === 'user' ? 'ml-8 rounded-xl bg-blue-600 p-3 text-sm text-white' : 'mr-8 rounded-xl bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100'}>{message.text}</div>)}
      {loading && <p className="text-xs text-slate-500">Gemini analyse le document…</p>}
    </div>
    {error && <p className="text-sm text-rose-600">{error}</p>}
    <form onSubmit={send} className="flex gap-2">
      <input value={input} onChange={(event) => setInput(event.target.value)} disabled={!document || loading} placeholder="Posez une question sur le cours…" className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-3 text-sm" />
      <button type="submit" disabled={!document || !input.trim() || loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Envoyer</button>
    </form>
  </section>;
};
