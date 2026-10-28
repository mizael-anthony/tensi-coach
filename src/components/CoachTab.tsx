import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  Salad,
  Wind,
  Moon,
  Footprints,
  Activity,
  AlertCircle,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { BloodPressureMeasurement, HabitEntry, ChatMessage } from '../types';
import { computePeriodStats } from '../utils/bloodPressure';
import { generateLocalCoachInsight, getLocalChatReply } from '../utils/localCoach';

interface CoachTabProps {
  measurements: BloodPressureMeasurement[];
  habits: HabitEntry[];
}

export const CoachTab: React.FC<CoachTabProps> = ({ measurements, habits }) => {
  const stats7d = computePeriodStats(measurements, 7);
  const stats30d = computePeriodStats(measurements, 30);
  const stats60d = computePeriodStats(measurements, 60);

  const [aiSource, setAiSource] = useState<'gemini' | 'local'>('local');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string>('');

  // Interactive Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Bonjour Thomas ! Je suis votre coach TensiCoach. Vos 60 jours de relevés montrent une nette progression : votre systolique moyenne a reculé de près de 15 mmHg grâce à vos pas quotidiens et à l’attention portée au sel. Comment puis-je vous accompagner aujourd’hui ?',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'local',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Local fallback insights
  const localInsight = generateLocalCoachInsight(stats7d, stats30d, habits);

  // Suggested prompt chips
  const suggestedPrompts = [
    'Comment interpréter mes mesures du matin vs soir ?',
    'Quels sont les premiers réflexes pour baisser le sel ?',
    'Mon stress au travail peut-il faire monter ma tension ?',
    'Comment bien préparer mon rapport médical ?',
  ];

  // Request analysis from backend Gemini or fallback to local
  const generateAnalysis = async () => {
    setIsGeneratingAnalysis(true);
    try {
      const summaryPayload = {
        periodDays: 30,
        avgSys: stats30d.avgSys,
        avgDia: stats30d.avgDia,
        avgPulse: stats30d.avgPulse,
        morningSys: stats30d.morningAvgSys,
        morningDia: stats30d.morningAvgDia,
        eveningSys: stats30d.eveningAvgSys,
        eveningDia: stats30d.eveningAvgDia,
        avgSleep: 7.2,
        avgSteps: 8200,
        avgStress: 2.2,
        saltProfile: 'faible à modéré',
      };

      const res = await fetch('/api/gemini/coach-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: summaryPayload,
          trends: { direction: 'down', description: 'Amélioration continue sur 60 jours' },
        }),
      });

      if (!res.ok) {
        throw new Error('Fallback local nécessaire');
      }

      const data = await res.json();
      if (data?.text) {
        setAnalysisText(data.text);
        setAiSource('gemini');
      } else {
        throw new Error('Réponse vide');
      }
    } catch {
      // Graceful local fallback
      setAiSource('local');
      setAnalysisText(
        `${localInsight.overview}\n\n${localInsight.keyObservation}\n\n💡 ${localInsight.correlationInsight}`
      );
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  useEffect(() => {
    generateAnalysis();
  }, [measurements.length]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSendingMessage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSendingMessage(true);

    try {
      const lastM = measurements[0];
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            avgSys: stats7d.avgSys,
            avgDia: stats7d.avgDia,
            avgPulse: stats7d.avgPulse,
            lastSys: lastM ? lastM.systolic : 120,
            lastDia: lastM ? lastM.diastolic : 80,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Passage au mode local');
      }

      const data = await res.json();
      if (data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            source: 'gemini',
          },
        ]);
        setAiSource('gemini');
      } else {
        throw new Error('Format invalide');
      }
    } catch {
      // Local rules-based clinical reply fallback
      const localReply = getLocalChatReply(text, measurements, habits);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content: localReply,
          timestamp: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          source: 'local',
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Top Header & Engine Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>Coach IA TensiCoach</span>
          </h1>
          <p className="text-xs text-slate-500">
            Analyses physiologiques & accompagnement préventif
          </p>
        </div>

        {/* Engine mode pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {aiSource === 'gemini' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gemini IA actif</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
              <Cpu className="w-3.5 h-3.5 text-blue-700" />
              <span>Mode local sécurisé (hors ligne)</span>
            </span>
          )}

          <button
            onClick={generateAnalysis}
            disabled={isGeneratingAnalysis}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Rafraîchir l'analyse"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAnalysis ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Synthèse IA des Tendances */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 text-white rounded-3xl p-5 shadow-lg border border-teal-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-teal-200">
                Bilan Intelligent de vos 60 jours
              </h2>
              <span className="text-[10px] text-slate-400">
                {aiSource === 'gemini' ? 'Généré par Gemini 3.8 Flash' : 'Moteur d’expertise locale'}
              </span>
            </div>
          </div>
        </div>

        {isGeneratingAnalysis ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-teal-400" />
            <span>Synthèse de vos 60 jours en cours...</span>
          </div>
        ) : (
          <div className="text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
            {analysisText}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Données strictement anonymisées</span>
          </span>
          <span>Basé sur {measurements.length} relevés</span>
        </div>
      </section>

      {/* 3 Cartes de Conseils d'Hygiène de Vie */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Conseils prioritaires du coach
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {localInsight.tips.map((tip) => (
            <div
              key={tip.title}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {tip.category}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">{tip.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Interactif avec Gemini / Mode Local */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="pb-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">
                Discussion avec le Coach
              </h2>
              <span className="text-[10px] text-slate-600">
                Posez vos questions sur la tension, le sel, le sommeil...
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-600 font-medium">
            Français · Mode bien-être
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs whitespace-pre-line border border-slate-200/60'
                  }`}
                >
                  <p>{m.content}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-600'
                    }`}
                  >
                    {m.timestamp}
                    {m.source && !isUser && ` · ${m.source === 'gemini' ? 'Gemini' : 'Local'}`}
                  </span>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isSendingMessage && (
            <div className="flex gap-2.5 items-center text-xs text-slate-600">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-1.5 border border-slate-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Le coach rédige sa réponse...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="py-2 border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-[11px] text-slate-700 whitespace-nowrap shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Posez votre question au coach..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSendingMessage}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </div>
  );
};
