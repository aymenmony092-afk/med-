import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Loader2, Trash2 } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const QUICK_PROMPTS = [
  'Explique-moi la physiopathologie de l’insuffisance cardiaque.',
  'Crée 5 QCM de niveau Résidanat avec corrections.',
  'Fais-moi une fiche de révision sur le diabète de type 2.',
];

export const AIStudyAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Bonjour ! Je suis votre assistant pédagogique MED DZ. Posez une question médicale, demandez une explication, une fiche de révision ou des QCM corrigés. Je distingue toujours les informations vérifiées des contenus générés par IA.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (text = input) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    const next = [...messages, { role: 'user' as const, text: prompt }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-12).map(({ role, text: content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Le service IA est momentanément indisponible.');
      setMessages((current) => [...current, { role: 'assistant', text: data.reply || 'Je n’ai pas pu formuler de réponse. Réessayez.' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion au service IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 p-3 text-blue-700 dark:text-blue-300"><Bot className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Assistant intelligent MED DZ</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gemini · Pédagogie médicale · Résidanat algérien</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Posez vos questions en français ou en arabe. L’assistant explique les notions, prépare des fiches et vous entraîne aux QCM. Il ne remplace pas les référentiels officiels ni l’avis d’un professionnel de santé.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Conversation pédagogique</div>
          <button onClick={() => { setMessages([{ role: 'assistant', text: 'Nouvelle conversation. Que souhaitez-vous réviser ?' }]); setError(''); }} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /> Effacer</button>
        </div>
        <div className="max-h-[55vh] min-h-[280px] space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2 text-blue-700 dark:text-blue-300"><Bot className="h-4 w-4" /></div>}
              <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>{message.text}</div>
              {message.role === 'user' && <div className="mt-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300"><User className="h-4 w-4" /></div>}
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Gemini prépare une réponse…</div>}
        </div>
        {error && <div className="mx-4 mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => <button key={prompt} disabled={loading} onClick={() => sendMessage(prompt)} className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 disabled:opacity-50">{prompt}</button>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="flex gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écrivez votre question médicale…" className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Envoyer" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      </section>
      <div className="flex items-center gap-2 text-xs text-slate-500"><Sparkles className="h-3.5 w-3.5" /> Les réponses générées par IA doivent être vérifiées avec les cours et recommandations officiels.</div>
    </div>
  );
};
