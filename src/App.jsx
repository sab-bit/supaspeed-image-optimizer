import { useEffect, useRef, useState } from 'react';
import { Aperture, ArrowUp, BookOpen, Check, ChevronDown, CircleHelp, Eye, EyeOff, Heart, ImagePlus, Mic2, MoreHorizontal, Settings, Sparkles, Volume2, VolumeX, X } from 'lucide-react';

const KEY_STORAGE = 'little-lessons-elevenlabs-key';
const VOICE_STORAGE = 'little-lessons-elevenlabs-voice';
const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'; // Rachel

function makeStoryReply(rawTopic) {
  const topic = rawTopic.trim().replace(/[.!?]+$/, '').slice(0, 100) || 'your idea';
  const lower = topic.toLowerCase();
  let analogy;
  if (/fraction|percent|decimal|math|addition|subtract|multip|division|algebra|equation|number/.test(lower)) {
    analogy = `Think of ${topic} like sharing a yummy pizza. The numbers are just little clues that tell us how many slices we have and who gets them.`;
  } else if (/plant|cell|animal|body|earth|space|planet|gravity|energy|water|science|atom|photosynth/.test(lower)) {
    analogy = `Imagine ${topic} is a tiny nature story. Everything has a job, a bit like a team: each part helps the next part do something.`;
  } else if (/history|war|king|queen|ancient|country|past|people|revolution/.test(lower)) {
    analogy = `Picture ${topic} as a story from a long, long time ago. People had a problem, made choices, and those choices changed what happened next.`;
  } else {
    analogy = `Imagine ${topic} is a new little thing in a storybook. We can understand it by connecting it to something you already know, like a game, a toy, or sharing a snack.`;
  }
  return `Let’s make it a tiny story!\n\n${analogy}\n\nThe simple bit: ${topic} is something we can learn one small piece at a time. First, remember the picture of ${topic} like a story. Then ask: “What is it doing, and why?”\n\nYou don’t need to know anything first. Want to tell me which little part feels puzzling?`;
}

function TutorPortrait({ photo, speaking, onChoose }) {
  return (
    <div className={`portrait ${photo ? 'has-photo' : ''} ${speaking ? 'is-speaking' : ''}`}>
      {photo ? <img className="portrait-photo" src={photo} alt="Your chosen tutor" /> : (
        <div className="avatar-art" aria-label="Illustrated tutor portrait">
          <div className="avatar-hair" /><div className="avatar-ear ear-left" /><div className="avatar-ear ear-right" />
          <div className="avatar-face"><span className="avatar-brow brow-left" /><span className="avatar-brow brow-right" /><span className="avatar-eye eye-left" /><span className="avatar-eye eye-right" /><span className="avatar-nose" /><span className="avatar-mouth" /></div>
          <div className="avatar-neck" /><div className="avatar-shirt" />
        </div>
      )}
      {photo && <div className="face-motion" aria-hidden="true"><i className="photo-eye eye-one" /><i className="photo-eye eye-two" /><i className="photo-mouth" /></div>}
      <button className="photo-button" onClick={onChoose}><ImagePlus size={16} /> Choose Tutor Photo</button>
      <div className="portrait-caption"><span className="online-dot" /> Your study buddy</div>
    </div>
  );
}

function SettingsDialog({ onClose, apiKey, setApiKey, voiceId, setVoiceId, onSave }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-top"><div className="modal-icon"><Settings size={19} /></div><button className="icon-button" onClick={onClose} aria-label="Close settings"><X size={19} /></button></div>
        <p className="eyebrow">MAKE IT YOURS</p><h2 id="settings-title">Tutor voice settings</h2>
        <p className="modal-copy">Add your ElevenLabs key to hear your study buddy speak. Your key stays in this browser on this device.</p>
        <label className="field-label" htmlFor="api-key">ElevenLabs API key</label>
        <div className="secret-field"><input id="api-key" type={visible ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your API key" autoComplete="off" /><button type="button" className="reveal-button" aria-label={visible ? 'Hide key' : 'Show key'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <label className="field-label" htmlFor="voice-id">Voice ID <span className="optional">(optional)</span></label>
        <input className="text-field" id="voice-id" value={voiceId} onChange={(e) => setVoiceId(e.target.value)} placeholder={DEFAULT_VOICE} />
        <p className="tiny-note">Rachel is selected by default. You can paste another voice ID from your ElevenLabs account.</p>
        <div className="privacy-note"><span><Eye size={16} /></span><p>This is a browser-only demo. The key is saved in local storage and sent directly from your browser to ElevenLabs when you request speech. Don’t use a shared device.</p></div>
        <button className="save-button" onClick={onSave}><Check size={17} /> Save voice settings</button>
      </section>
    </div>
  );
}

function CameraMirror({ videoRef, cameraState, onStart, onStop }) {
  return (
    <section className="mirror-card" aria-label="Camera mirror">
      <div className="mirror-top"><div><p className="eyebrow">YOUR SIDE</p><h2>Study mirror</h2></div><span className={`camera-status ${cameraState === 'on' ? 'status-on' : ''}`}><i />{cameraState === 'on' ? 'Camera on' : 'Camera off'}</span></div>
      <div className="mirror-view">
        <video ref={videoRef} autoPlay playsInline muted className={cameraState === 'on' ? 'video-live' : ''} />
        {cameraState !== 'on' && <div className="camera-empty"><div className="camera-orbit"><Aperture size={28} strokeWidth={1.5} /></div><p>{cameraState === 'error' ? 'Camera access wasn’t available' : 'Your camera stays off until you turn it on.'}</p><span>{cameraState === 'error' ? 'Check browser permissions and try again.' : 'You’re in control, always.'}</span></div>}
        <div className="mirror-label"><span className="record-dot" /> LIVE MIRROR</div>
        {cameraState === 'on' && <button className="camera-toggle" onClick={onStop}><EyeOff size={16} /> Turn camera off</button>}
      </div>
      {cameraState !== 'on' && <button className="camera-start" onClick={onStart}><Aperture size={17} /> Turn on front camera</button>}
    </section>
  );
}

export default function App() {
  const [photo, setPhoto] = useState('');
  const [cameraState, setCameraState] = useState('off');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi, friend! 🌼\n\nTell me what you’re learning, and we’ll turn it into a tiny, easy story together. No big words needed.' }]);
  const [draft, setDraft] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORAGE) || '');
  const [voiceId, setVoiceId] = useState(() => localStorage.getItem(VOICE_STORAGE) || DEFAULT_VOICE);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notice, setNotice] = useState('');
  const photoInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [messages]);
  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); audioRef.current?.pause(); window.speechSynthesis?.cancel(); }, []);

  function choosePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('Please choose an image file.'); return; }
    if (file.size > 12 * 1024 * 1024) { setNotice('That photo is a little large. Choose an image under 12 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setCameraState('error'); setNotice('Camera access needs a supported browser and a secure HTTPS page.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraState('on');
    } catch (error) {
      setCameraState('error');
      setNotice(error.name === 'NotAllowedError' ? 'Camera permission was blocked. Allow camera access in your browser settings to use the mirror.' : 'Could not start the camera. Check that it is available and try again.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState('off');
  }

  async function speak(text) {
    if (!audioEnabled) return;
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setSpeaking(true);
    if (apiKey.trim()) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId.trim() || DEFAULT_VOICE)}`, {
          method: 'POST',
          headers: { 'xi-api-key': apiKey.trim(), 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
          body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.48, similarity_boost: 0.78 } }),
        });
        if (!response.ok) throw new Error('ElevenLabs could not create speech. Check your key, voice ID, or available credits.');
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(audio.src); setSpeaking(false); };
        audio.onerror = () => setSpeaking(false);
        await audio.play();
        return;
      } catch (error) {
        setNotice(error.message || 'Voice service unavailable. Using your browser voice instead.');
      }
    }
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.06;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else setSpeaking(false);
  }

  function sendMessage(event) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const reply = makeStoryReply(text);
    setMessages((current) => [...current, { role: 'user', text }, { role: 'assistant', text: reply }]);
    setDraft('');
    speak(reply.replace(/\n/g, ' '));
  }

  function saveSettings() {
    localStorage.setItem(KEY_STORAGE, apiKey.trim());
    localStorage.setItem(VOICE_STORAGE, voiceId.trim() || DEFAULT_VOICE);
    setSettingsOpen(false);
    setNotice('Voice settings saved on this device.');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Little Lessons home"><span className="brand-mark"><BookOpen size={19} /></span><span>little lessons<span className="brand-period">.</span></span></a>
        <div className="session-pill"><span className="online-dot" /> YOUR QUIET STUDY ROOM</div>
        <div className="top-actions"><button className={`sound-button ${audioEnabled ? '' : 'muted'}`} onClick={() => { setAudioEnabled((value) => !value); if (audioEnabled) { window.speechSynthesis?.cancel(); audioRef.current?.pause(); setSpeaking(false); } }} aria-label={audioEnabled ? 'Mute tutor' : 'Enable tutor sound'}>{audioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>{audioEnabled ? 'Sound on' : 'Sound off'}</span></button><button className="settings-button" onClick={() => setSettingsOpen(true)} aria-label="Open voice settings"><Settings size={18} /><span>Settings</span></button></div>
      </header>

      <section className="stage-heading"><div><p className="eyebrow">A LITTLE SPACE TO LEARN</p><h1>Let’s figure it out <span>together.</span></h1><p className="heading-subtitle">Small stories. Gentle reminders. One idea at a time.</p></div><div className="streak-badge"><span>✦</span> You’re doing great just by showing up</div></section>

      <section className="video-stage">
        <article className="tutor-card">
          <div className="tutor-top"><div><p className="eyebrow">YOUR FRIENDLY TUTOR</p><h2>Face-to-face learning</h2></div><button className="more-button" aria-label="Tutor information" onClick={() => setNotice('Your study buddy explains topics with simple story-style examples.') }><MoreHorizontal size={20} /></button></div>
          <TutorPortrait photo={photo} speaking={speaking} onChoose={() => photoInputRef.current?.click()} />
          <input ref={photoInputRef} className="visually-hidden" type="file" accept="image/*" onChange={choosePhoto} aria-label="Choose a tutor photo" />
          <div className="tutor-footer"><div className="tutor-name"><span className="name-sparkle"><Sparkles size={14} /></span><div><strong>Your study buddy</strong><small>{speaking ? 'Talking you through it…' : 'Here for your next big idea'}</small></div></div><div className="talking-indicator" aria-label={speaking ? 'Tutor is speaking' : 'Tutor is listening'}>{speaking ? <><i /><i /><i /><i /><i /></> : <Heart size={16} />}</div></div>
        </article>
        <CameraMirror videoRef={videoRef} cameraState={cameraState} onStart={startCamera} onStop={stopCamera} />
      </section>

      <section className="chat-card" aria-label="Study chat">
        <div className="chat-heading"><div className="chat-heading-icon"><Sparkles size={17} /></div><div><h2>What are we learning?</h2><p>I’ll explain it with a story, nice and slowly.</p></div><span className="gentle-tag"><Heart size={13} /> ZERO pressure</span></div>
        <div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${index}-${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'You'}</div><div className="message-bubble"><span className="message-author">{message.role === 'assistant' ? 'STUDY BUDDY' : 'YOU'}</span><p>{message.text}</p>{message.role === 'assistant' && index > 0 && <button className="replay-button" onClick={() => speak(message.text.replace(/\n/g, ' '))}><Volume2 size={13} /> Hear that again</button>}</div></div>)}<div ref={chatEndRef} /></div>
        <form className="composer" onSubmit={sendMessage}><div className="composer-decoration"><Mic2 size={17} /></div><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a school note or topic…" aria-label="Type a school note or topic" /><button className="send-button" type="submit" disabled={!draft.trim()}><span>Let’s learn</span><ArrowUp size={17} /></button></form>
        <div className="chat-footnote"><span><CircleHelp size={13} /> Nothing is too easy or too tricky to ask.</span><span>Made for curious minds <Heart size={12} fill="currentColor" /></span></div>
      </section>

      <footer className="page-footer"><span><span className="footer-flower">✿</span> Take your time. You’re learning.</span><span>Your camera is only on when you choose.</span></footer>
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} apiKey={apiKey} setApiKey={setApiKey} voiceId={voiceId} setVoiceId={setVoiceId} onSave={saveSettings} />}
    </main>
  );
}
