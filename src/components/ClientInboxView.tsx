'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Phone, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  User, 
  Flame, 
  DollarSign, 
  Calendar, 
  RefreshCw, 
  Search, 
  Check, 
  ChevronRight, 
  ShieldCheck,
  Paperclip,
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  FileText,
  FileArchive,
  File as FileIcon,
  Image as ImageIcon,
  Download,
  X,
  Volume2,
  AlertCircle,
  Eye,
  Printer
} from 'lucide-react';
import { EmailThread, EmailMessage, ChatAttachment, VoiceNoteData } from '@/types';

interface ClientInboxViewProps {
  onOpenWebsitePreview: (previewUrl: string) => void;
  onClientReplyReceived?: (clientName: string, snippet: string) => void;
}

// Custom Voice Note Player Component
function VoiceNotePlayer({ 
  voiceNote, 
  isUser 
}: { 
  voiceNote: VoiceNoteData; 
  isUser: boolean; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceNote.durationSeconds || 15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && voiceNote.url) {
      audioRef.current.src = voiceNote.url;
    }
  }, [voiceNote.url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error or blocked by autoplay policy:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(Math.round(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fixed visualizer heights for waveform representation
  const barHeights = [28, 45, 70, 35, 60, 85, 40, 65, 95, 50, 75, 40, 80, 55, 30, 60, 90, 45, 65, 35];

  return (
    <div className={`mt-2.5 p-3 rounded-2xl flex flex-col gap-2 transition-all ${
      isUser 
        ? 'bg-blue-600/90 text-white border border-blue-400/40 shadow-sm' 
        : 'bg-slate-100 text-slate-800 border border-slate-200/90 shadow-sm'
    }`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center justify-between text-[11px] font-bold opacity-90">
        <span className="flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-amber-400" />
          <span>Voice Message</span>
        </span>
        <span className="font-mono text-[10px]">
          {formatSecs(currentTime)} / {formatSecs(duration)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition active:scale-95 ${
            isUser
              ? 'bg-white text-[#1877F2] hover:bg-slate-100'
              : 'bg-[#1877F2] text-white hover:bg-blue-600'
          }`}
          title={isPlaying ? 'Pause' : 'Play voice message'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Dynamic Waveform Visualizer & Scrubber */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-0.5 h-6 px-1">
            {barHeights.map((h, i) => {
              const progress = duration > 0 ? (currentTime / duration) : 0;
              const barProgress = i / barHeights.length;
              const hasPassed = barProgress <= progress;

              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlaying 
                      ? 'animate-pulse' 
                      : ''
                  } ${
                    isUser
                      ? (hasPassed ? 'bg-white' : 'bg-blue-300/60')
                      : (hasPassed ? 'bg-[#1877F2]' : 'bg-slate-300')
                  }`}
                  style={{
                    height: `${isPlaying ? Math.max(20, (h * (0.6 + Math.random() * 0.5))) : h}%`,
                  }}
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-transparent cursor-pointer appearance-none accent-white"
          />
        </div>
      </div>
    </div>
  );
}

export default function ClientInboxView({
  onOpenWebsitePreview,
  onClientReplyReceived,
}: ClientInboxViewProps) {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'pricing'>('all');
  const [search, setSearch] = useState('');
  
  // Composer states
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedVoiceNote, setRecordedVoiceNote] = useState<VoiceNoteData | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Lightbox / Image preview modal state
  const [viewingImage, setViewingImage] = useState<{ url: string; name: string } | null>(null);
  // Document / PDF Viewer Modal state
  const [viewingDocument, setViewingDocument] = useState<ChatAttachment | null>(null);

  // Attachment opener & download handler
  const handleOpenAttachment = (file: ChatAttachment) => {
    if (file.type === 'image' && file.url && file.url !== '#') {
      setViewingImage({ url: file.url, name: file.name });
    } else {
      setViewingDocument(file);
    }
  };

  const handleDownloadAttachment = (e: React.MouseEvent, file: ChatAttachment) => {
    e.stopPropagation();
    try {
      if (file.url && file.url !== '#' && file.url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Generate downloadable PDF Blob
      const pdfHeader = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n4 0 obj<</Length 180>>stream\nBT\n/F1 16 Tf\n50 720 Td\n(${file.name}) Tj\n/F1 11 Tf\n50 690 Td\n(CognitiveScale Dynamics - Brand Guidelines & SOW) Tj\n50 660 Td\n(Next.js 14 Redesign & Mobile Architecture Specifications) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n440\n%%EOF`;
      const blob = new Blob([pdfHeader], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch threads
  const loadThreads = async (markReadId?: string) => {
    try {
      const url = markReadId ? `/api/inbox?markRead=${markReadId}` : '/api/inbox';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads);
        if (!selectedThreadId && data.threads.length > 0) {
          setSelectedThreadId(data.threads[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to load inbox threads');
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    loadThreads(id);
    setRecordedVoiceNote(null);
    setAttachments([]);
    setReplyText('');
  };

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (filter === 'unread' && !t.unread) return false;
    if (filter === 'booking' && t.sentiment !== 'booking') return false;
    if (filter === 'pricing' && t.sentiment !== 'pricing') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.businessName.toLowerCase().includes(q) ||
        t.contactPerson.toLowerCase().includes(q) ||
        t.lastMessageSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle File Input Selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    fileList.forEach((file) => {
      // Determine file category
      let category = 'file';
      if (file.type.startsWith('image/')) category = 'image';
      else if (file.type.includes('pdf')) category = 'pdf';
      else if (file.type.includes('word') || file.type.includes('document') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) category = 'doc';
      else if (file.type.includes('zip') || file.type.includes('tar') || file.type.includes('compressed')) category = 'archive';

      // Format size
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAttachment: ChatAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: sizeStr,
          type: category,
          url: dataUrl || '#',
        };

        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so user can pick same file again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Voice Recording Implementation
  const startRecording = async () => {
    setMicError(null);
    setRecordedVoiceNote(null);

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicError('Audio recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : MediaRecorder.isTypeSupported('audio/webm')
        ? { mimeType: 'audio/webm' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        
        // Convert Blob to Data URL so it is fully self-contained and durable
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setRecordedVoiceNote({
            url: base64Audio,
            durationSeconds: Math.max(1, recordingDuration),
          });
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };

      mediaRecorder.start(200); // Collect data every 200ms
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access denied or failed:', err);
      setMicError(err?.message || 'Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
    setRecordedVoiceNote(null);
  };

  // Handle Send Reply (Text + Attachments + Voice Note)
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedThreadId) return;

    const hasText = replyText.trim().length > 0;
    const hasAttachments = attachments.length > 0;
    const hasVoice = !!recordedVoiceNote;

    if (!hasText && !hasAttachments && !hasVoice) return;

    try {
      setSendingReply(true);
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: selectedThreadId,
          replyText: replyText.trim(),
          attachments: hasAttachments ? attachments : undefined,
          voiceNote: hasVoice ? recordedVoiceNote : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        setAttachments([]);
        setRecordedVoiceNote(null);
        setReplySentSuccess(true);
        setTimeout(() => setReplySentSuccess(false), 3500);
        await loadThreads();

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (e) {
      console.error('Failed to send reply:', e);
    } finally {
      setSendingReply(false);
    }
  };

  // Simulate an incoming client reply
  const handleSimulateClientReply = async () => {
    if (!selectedThreadId) return;

    try {
      setSimulating(true);
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate',
          threadId: selectedThreadId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await loadThreads();
        if (onClientReplyReceived && data.thread) {
          onClientReplyReceived(data.thread.contactPerson, data.thread.lastMessageSnippet);
        }
      }
    } catch (e) {
      console.error('Failed to simulate reply:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Quick reply snippet injector
  const applyQuickReply = (text: string) => {
    setReplyText(text);
  };

  // Helper for formatting duration
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[82vh] relative">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold shadow-2xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Client Responses &amp; Inbound Inbox
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Inbound Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              When clients reply to your website pitch, proposals show up here in real time
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {selectedThread && (
            <button
              onClick={handleSimulateClientReply}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs transition active:scale-95 disabled:opacity-50"
              title="Simulate an immediate client response for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{simulating ? 'Receiving...' : 'Simulate Client Reply'}</span>
            </button>
          )}

          <button
            onClick={() => loadThreads()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Refresh inbox"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Pane Inbox Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Conversations List */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200/90 flex flex-col bg-slate-50/40 shrink-0">
          {/* Search & Filter pills */}
          <div className="p-3 border-b border-slate-200/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'all' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({threads.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'unread' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread ({threads.filter((t) => t.unread).length})
              </button>
              <button
                onClick={() => setFilter('booking')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'booking' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Call Requests
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                const sentimentBadge = {
                  booking: { label: '📅 Zoom Call Request', color: 'bg-emerald-100 text-emerald-800' },
                  pricing: { label: '💰 Pricing Inquiry', color: 'bg-blue-100 text-blue-800' },
                  positive: { label: '✨ Positive Interest', color: 'bg-purple-100 text-purple-800' },
                  neutral: { label: 'Inbound Message', color: 'bg-slate-100 text-slate-700' },
                }[thread.sentiment || 'neutral'];

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-[#1877F2]'
                        : thread.unread
                        ? 'bg-white hover:bg-slate-50 font-bold'
                        : 'bg-transparent hover:bg-slate-100/60 text-slate-600'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 shadow-inner">
                      {thread.contactPerson.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {thread.contactPerson}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal shrink-0">
                          {thread.lastMessageAt}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600 block truncate">
                        {thread.businessName} &bull; {thread.city}
                      </span>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-snug">
                        {thread.lastMessageSnippet}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        {sentimentBadge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${sentimentBadge.color}`}
                          >
                            {sentimentBadge.label}
                          </span>
                        )}
                        {thread.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#1877F2] ml-auto shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Thread History & Composer */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Thread Header Bar */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {selectedThread.businessName}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">&bull;</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {selectedThread.contactPerson} ({selectedThread.clientEmail})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Location: {selectedThread.city}, {selectedThread.country}
                </span>
              </div>

              {/* Quick Contact & Preview Actions */}
              <div className="flex items-center gap-2">
                {selectedThread.leadId && (
                  <button
                    onClick={() => onOpenWebsitePreview(`/preview/${selectedThread.leadId}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Pitch Website</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
              {selectedThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      <span>&bull;</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-2xl rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1877F2] text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {/* Message Content */}
                      {msg.content && (
                        <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      )}

                      {/* Voice Note Audio Player */}
                      {msg.voiceNote && (
                        <VoiceNotePlayer voiceNote={msg.voiceNote} isUser={isUser} />
                      )}

                      {/* File Attachments Grid */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <span className={`text-[10px] font-bold block ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                            Attached Files ({msg.attachments.length}):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.attachments.map((file) => {
                              const isImg = file.type === 'image';
                              return (
                                <div
                                  key={file.id}
                                  onClick={() => handleOpenAttachment(file)}
                                  className={`rounded-2xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer border shadow-2xs group select-none ${
                                    isUser
                                      ? 'bg-blue-700/70 hover:bg-blue-700 border-blue-400/60 text-white'
                                      : 'bg-white hover:bg-blue-50/60 border-slate-200/90 text-slate-800 hover:border-blue-400 hover:shadow-md'
                                  }`}
                                  title={`Click to open and preview ${file.name}`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${
                                      isUser 
                                        ? 'bg-blue-600 text-white' 
                                        : (file.type === 'pdf' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-[#1877F2] border border-blue-100')
                                    }`}>
                                      {isImg ? (
                                        <ImageIcon className="w-4 h-4" />
                                      ) : file.type === 'pdf' ? (
                                        <FileText className="w-4 h-4 text-rose-500" />
                                      ) : file.type === 'archive' ? (
                                        <FileArchive className="w-4 h-4 text-amber-500" />
                                      ) : (
                                        <FileIcon className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-xs block truncate" title={file.name}>
                                          {file.name}
                                        </span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#1877F2] font-extrabold hidden sm:inline">
                                          (Click to Open)
                                        </span>
                                      </div>
                                      <span className={`text-[10px] block ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {file.size} &bull; {file.type.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                                      isUser 
                                        ? 'bg-blue-600 text-white group-hover:bg-blue-500' 
                                        : 'bg-blue-50 text-[#1877F2] group-hover:bg-blue-100'
                                    }`}>
                                      <Eye className="w-3 h-3" />
                                      <span>Open</span>
                                    </span>

                                    <button
                                      type="button"
                                      onClick={(e) => handleDownloadAttachment(e, file)}
                                      className={`p-1.5 rounded-lg transition ${
                                        isUser
                                          ? 'hover:bg-blue-600 text-white'
                                          : 'hover:bg-slate-100 text-slate-500 hover:text-[#1877F2]'
                                      }`}
                                      title={`Download ${file.name}`}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Attached Live Website Pill if present */}
                      {msg.previewUrl && (
                        <div
                          onClick={() => onOpenWebsitePreview(msg.previewUrl!)}
                          className={`mt-3 p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 border transition ${
                            isUser
                              ? 'bg-blue-600/80 border-blue-400 text-white hover:bg-blue-600'
                              : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span className="font-bold text-xs">
                              Interactive Website Preview Attached
                            </span>
                          </div>
                          <span className="text-[11px] underline flex items-center gap-0.5">
                            Open <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Closing Templates Bar */}
            <div className="px-5 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 text-[10px]">
                Quick Pitch Closers:
              </span>
              <button
                type="button"
                onClick={() =>
                  applyQuickReply(
                    `Hi ${selectedThread.contactPerson},\n\nSounds fantastic! I'd love to connect on Friday at 4:30 PM. Here is our direct calendar booking link or I can call you at your office number.\n\nLooking forward to speaking with you!\n\nBest regards,\nSameer`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition shrink-0"
              >
                📅 Confirm Friday Call
              </button>
              <button
                type="button"
                onClick={() =>
                  applyQuickReply(
                    `Hi ${selectedThread.contactPerson},\n\nThanks for asking! Our complete turnkey package includes custom design, mobile optimization, SEO, and domain deployment for PKR 180,000 / $1,500 with 7-day turnaround.\n\nShould we prepare the kickoff paperwork?`
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition shrink-0"
              >
                💵 Send Pricing Package
              </button>
            </div>

            {/* Hidden File Input for Multiple Uploads */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              className="hidden"
            />

            {/* Composer Container */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-2">
              {/* Mic Error Banner */}
              {micError && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{micError}</span>
                  </div>
                  <button onClick={() => setMicError(null)} className="p-1 hover:bg-rose-100 rounded-md">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Attachments Preview Tray */}
              {attachments.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                    >
                      {file.type === 'image' ? (
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({file.size})</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-[#1877F2] hover:underline px-2 shrink-0"
                  >
                    + Add more
                  </button>
                </div>
              )}

              {/* Recorded Voice Note Preview Badge before sending */}
              {recordedVoiceNote && !isRecording && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                      <Mic className="w-3 h-3" />
                    </div>
                    <span>Voice Memo Recorded ({formatTimer(recordedVoiceNote.durationSeconds)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRecordedVoiceNote(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Discard Voice Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Recording Active Mode Strip */}
              {isRecording ? (
                <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 border border-slate-800 shadow-md animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
                      <span className="w-3 h-3 rounded-full bg-rose-600 relative" />
                    </div>
                    <span className="font-mono text-sm font-bold tracking-wider text-rose-400">
                      REC {formatTimer(recordingDuration)}
                    </span>
                  </div>

                  {/* Simulated Dynamic Soundwave */}
                  <div className="flex items-center gap-1 h-6">
                    {[12, 24, 40, 18, 30, 48, 20, 36, 16, 28, 44, 22].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-blue-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(6, (h * (0.5 + Math.random() * 0.5)))}px`,
                          animationDelay: `${i * 75}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-400 transition"
                      title="Cancel and discard recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                      title="Stop and preview voice message"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Finish</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Textarea Form */
                <form onSubmit={handleSendReply} className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write message to ${selectedThread.contactPerson}...`}
                      className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-3 pr-24 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-sans resize-none"
                    />

                    {/* Integrated Quick Media Action Buttons inside Textarea */}
                    <div className="absolute right-2.5 bottom-3 flex items-center gap-1.5 bg-slate-50/90 pl-1.5 rounded-lg">
                      {/* Attachment Trigger */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-lg text-slate-500 hover:text-[#1877F2] hover:bg-blue-50 transition"
                        title="Upload file (Images, PDF, Documents, Archives)"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      {/* Microphone Voice Note Trigger */}
                      <button
                        type="button"
                        onClick={startRecording}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Record Voice Note / Voice Message"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Bar: Status + Send Button */}
                  <div className="flex items-center justify-between">
                    {replySentSuccess ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reply &amp; media sent to client successfully!</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Dispatches to {selectedThread.clientEmail}</span>
                        {(attachments.length > 0 || recordedVoiceNote) && (
                          <span className="font-bold text-blue-600">
                            &bull; Includes {attachments.length > 0 ? `${attachments.length} attachment(s)` : ''} {recordedVoiceNote ? '+ 1 Voice Memo' : ''}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sendingReply || (!replyText.trim() && attachments.length === 0 && !recordedVoiceNote)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingReply ? 'Sending...' : 'Send Client Reply'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Select a conversation to view thread.
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold truncate max-w-md">{viewingImage.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={viewingImage.url}
                  download={viewingImage.name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setViewingImage(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/40 overflow-auto">
              <img
                src={viewingImage.url}
                alt={viewingImage.name}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive PDF & Document Previewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#161f2e] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Document Header Bar */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-white truncate">
                      {viewingDocument.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                      Official Client PDF
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    Verified Document &bull; {viewingDocument.size} &bull; Security Scanned
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleDownloadAttachment(e, viewingDocument)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm"
                  title="Download PDF to computer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingDocument(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title="Close document preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Reader Sheet */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-[#0c1320] space-y-6">
              <div className="bg-white dark:bg-[#1a2537] rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/90 dark:border-slate-800 max-w-2xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 select-text">
                {/* PDF Page Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 pb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1877F2] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md inline-block mb-2">
                      Client Design System &amp; SOW Directive
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      CognitiveScale Dynamics Inc.
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      B2B SaaS Corporate Redesign &bull; Next.js 14 Architecture Specification v3.2
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Oct 2026 Edition
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                      ✓ Pre-Approved SOW
                    </span>
                  </div>
                </div>

                {/* Section 1: Overview */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                    1. Executive Brief &amp; Design Philosophy
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    We are migrating our existing legacy web portal to an ultra-modern, glassmorphic Next.js 14 + Tailwind CSS architecture. The UI must convey institutional trust, high-tech B2B innovation, and responsive speed across all devices.
                  </p>
                </div>

                {/* Section 2: Color Palette Tokens */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                    2. Primary Color Tokens &amp; Theme Matrix
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-sans">Obsidian Dark</span>
                      <span className="font-bold">#080E1B</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1877F2] text-white">
                      <span className="text-[10px] text-blue-200 block font-sans">Meta Blue</span>
                      <span className="font-bold">#1877F2</span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-400 text-slate-900">
                      <span className="text-[10px] text-cyan-900 block font-sans">Electric Cyan</span>
                      <span className="font-bold">#00E5FF</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block font-sans">Surface Card</span>
                      <span className="font-bold">#F8FAFC</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Technical Deliverables */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                    3. Required Scope of Work Deliverables
                  </h4>
                  <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-5">
                    <li><b>8-10 Custom Pages:</b> Hero, Enterprise AI Solutions, Client Case Studies, Dynamic Pricing Packages, Zoom Consultation Integration.</li>
                    <li><b>Glassmorphism Card Elevation:</b> Subtle frosted blur (<code>backdrop-blur-md</code>) with fine borders and luxury shadows.</li>
                    <li><b>Performance Target:</b> Google PageSpeed score of 95+ with sub-second page transitions.</li>
                    <li><b>Confidentiality:</b> Work covered under standard mutual NDA pre-cleared by Head of Growth.</li>
                  </ul>
                </div>

                {/* Section 4: Author Footnote */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Author: <b>Elena Rostova (Head of Growth, CognitiveScale)</b></span>
                  <span className="font-mono text-[11px]">Attachment ID: att-1-verified</span>
                </div>
              </div>
            </div>

            {/* Document Footer Actions */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-[#111927] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Viewing 1 of 1 attached client documents
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingDocument(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDownloadAttachment(e, viewingDocument)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
