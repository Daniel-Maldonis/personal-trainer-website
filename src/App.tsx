import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Dumbbell, 
  Calendar, 
  CheckCircle, 
  Award, 
  User, 
  TrendingUp, 
  Heart, 
  Clock, 
  Flame, 
  Droplet, 
  MessageSquare, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronLeft,
  CalendarDays,
  Menu,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { testimonialsData, workoutTemplates, getCustomRoutine, mockDefaultWorkout } from './data';
import { Exercise, WorkoutProgram, Booking, ChatMessage } from './types';

// Constants referencing generated premium assets
const heroBackground = "/src/assets/images/hero_background_1781578641487.jpg";
const trainerLucas = "/src/assets/images/trainer_lucas_1781578658269.jpg";

export default function App() {
  // Navigation & UI control states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'treinos' | 'calculadoras' | 'chat' | 'agendamento'>('home');

  // Workout generator state
  const [selectedGoal, setSelectedGoal] = useState<string>('Hipertrofia');
  const [selectedFocus, setSelectedFocus] = useState<string>('Corpo Inteiro');
  const [selectedLevel, setSelectedLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [currentProgram, setCurrentProgram] = useState<WorkoutProgram>(mockDefaultWorkout);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerMax, setTimerMax] = useState(60);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Health Calculators values
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175); // in cm
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');
  const [activityLevel, setActivityLevel] = useState<string>('1.55'); // moderado
  
  // Dynamic hydration tracking
  const [waterDrunk, setWaterDrunk] = useState<number>(0); // cups of 250ml
  
  // Before/after image slider state (0 to 100 percent)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bora treinar! 💪 Sou o Coach Lucas, seu personal trainer inteligente. Escolheu seu foco hoje, ou quer planejar sua dieta? Me manda qualquer dúvida pra esmagar suas metas!',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Appointment states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('08:00');
  const [bookingGoal, setBookingGoal] = useState('Emagrecimento');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Quiz onboarding states
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = not started
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Load bookings and stats from LocalStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('coach_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    const savedWater = localStorage.getItem('water_drunk_today');
    if (savedWater) {
      setWaterDrunk(parseInt(savedWater, 10));
    }
  }, []);

  // Save bookings to LocalStorage
  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('coach_bookings', JSON.stringify(newBookings));
  };

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            triggerBeepSound(); // Play AudioContext synthesized feedback
            setTimerActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  // Audio synthesizer using Web Audio API to play a beep-beep sound at rest completion
  const triggerBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (freq: number, delay: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };

      // Play double sport beep-beep
      playBeep(880, 0, 0.15); // A5 high beep
      playBeep(880, 0.2, 0.15); // A5 high beep
    } catch (e) {
      console.log("AudioContext not supported or gesture blocked", e);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle Workout Generation
  const handleGenerateWorkout = () => {
    const routine = getCustomRoutine(selectedGoal, selectedFocus, selectedLevel);
    setCurrentProgram(routine);
    setCompletedExercises({});
    setWorkoutStarted(false);
    setTimerActive(false);
    setActiveExerciseIndex(null);
  };

  // Handle Workout Start
  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCompletedExercises({});
    setActiveExerciseIndex(0);
  };

  // Checkbox complete exercise toggle
  const toggleExerciseComplete = (exerciseName: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName]
    }));
  };

  // Rest Timer activator
  const startRestTimer = (seconds: number, index: number) => {
    setTimerMax(seconds);
    setTimeRemaining(seconds);
    setTimerActive(true);
    setActiveExerciseIndex(index);
    // Auto scroll to rest card
    setTimeout(() => {
      document.getElementById('rest-timer-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Hydration control
  const adjustWater = (amount: number) => {
    const nextVal = Math.max(0, waterDrunk + amount);
    setWaterDrunk(nextVal);
    localStorage.setItem('water_drunk_today', nextVal.toString());
  };

  // Calculators logic
  const imc = weight / ((height / 100) * (height / 100));
  
  const getImcLevel = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do Peso', color: 'text-amber-400', bg: 'bg-amber-400/20', desc: 'Reforce o consumo de nutrientes e foque em hipertrofia!' };
    if (val < 25) return { label: 'Peso Ideal / Saudável', color: 'text-lime-400', bg: 'bg-lime-400/20', desc: 'Estado excelente! Continue mantendo a constância nos treinos!' };
    if (val < 30) return { label: 'Sobrepeso', color: 'text-orange-400', bg: 'bg-orange-400/20', desc: 'Foque em queima aeróbica e controle calórico aliado a treinos de força.' };
    return { label: 'Obesidade', color: 'text-red-500', bg: 'bg-red-500/20', desc: 'Perigo biomecânico. Vamos diminuir impactos e construir metabolismo ativo com musculação.' };
  };

  // Calores target calculation (Mifflin-St Jeor formula + physical multiplier)
  const bmr = gender === 'masculino' 
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5 
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  const tdee = Math.round(bmr * parseFloat(activityLevel));

  // Draggable image slider calculation
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const proportion = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    setSliderPosition(proportion);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const proportion = Math.max(0, Math.min(100, (cursorX / rect.width) * 100));
    setSliderPosition(proportion);
  };

  // Chat API submit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.content,
          chatHistory: chatMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Opa! Deu uma leve falha na minha conexão. Mas bora continuar focados, repita a pergunta!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bora treinar! 💪 Meu sensor de fadiga avisou que o servidor oscilou. Mas a dica prática de hoje é treinar agachamento com sobrecarga progressiva e beber no mínimo 3L de água!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Booking submit
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDate) return;

    const newBooking: Booking = {
      id: Math.random().toString(),
      name: bookingName,
      email: bookingEmail,
      date: bookingDate,
      timeSlot: bookingTime,
      goal: bookingGoal,
      confirmed: true
    };

    const updated = [...bookings, newBooking].sort((a,b) => a.date.localeCompare(b.date));
    saveBookings(updated);
    setBookingSuccess(true);
    setBookingName('');
    setBookingEmail('');
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setBookingSuccess(false);
    }, 5000);
  };

  // Remove booking
  const cancelBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookings(updated);
  };

  // Onboarding Quiz questions
  const quizQuestions = [
    {
      key: 'level',
      title: 'Qual seu nível atual de experiência com treinos físicos?',
      options: [
        { label: 'Iniciante (Nunca treinei ou faz muito tempo)', val: 'Iniciante' },
        { label: 'Intermediário (Treino de 2 a 3 vezes por semana)', val: 'Intermediário' },
        { label: 'Avançado (Consistente há mais de 1 ano com intensidade)', val: 'Avançado' }
      ]
    },
    {
      key: 'goal',
      title: 'Qual é o seu objetivo principal no momento?',
      options: [
        { label: 'Hipertrofia (Ganho de massa muscular de qualidade)', val: 'Hipertrofia' },
        { label: 'Emagrecimento (Queimar gordura e definir o corpo)', val: 'Emagrecimento' },
        { label: 'Resistência (Melhora cardiovascular e do fôlego)', val: 'Resistência' }
      ]
    },
    {
      key: 'diet',
      title: 'Como você descreveria sua alimentação diária atual?',
      options: [
        { label: 'Desregrada (Como o que for prático sem contar nutrientes)', val: 'Desregrada' },
        { label: 'Moderada (Evito frituras mas sem regras muito rígidas)', val: 'Moderada' },
        { label: 'Equilibrada (Sigo dieta limpa e monitoro proteínas)', val: 'Equilibrada' }
      ]
    }
  ];

  const handleQuizAnswer = (key: string, val: string) => {
    setQuizAnswers(prev => ({ ...prev, [key]: val }));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setShowQuizResult(true);
      // Auto apply to generator presets!
      if (key === 'goal' || quizAnswers.goal) {
        setSelectedGoal(key === 'goal' ? val : quizAnswers.goal);
      }
      setSelectedLevel(quizAnswers.level as any || (key === 'level' ? val : 'Iniciante') as any);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setShowQuizResult(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-gray-100 flex flex-col selection:bg-neon selection:text-black">
      
      {/* NAVBAR */}
      <nav id="navbar" className="sticky top-0 z-50 glass border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Header branding */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center shadow-lg shadow-neon/25 transition-transform hover:scale-105">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 uppercase">
                  Lucas Silva <span className="text-neon">Elite</span>
                </span>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Personal Trainer</p>
              </div>
            </div>

            {/* Desktop Navigation Links conforming to prompt's aesthetic layout */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'home' ? 'text-neon bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Início
              </button>
              <button 
                onClick={() => { setActiveTab('treinos'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'treinos' ? 'text-neon bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Criador de Treino
              </button>
              <button 
                onClick={() => { setActiveTab('calculadoras'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'calculadoras' ? 'text-neon bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Calculadoras Fitness
              </button>
              <button 
                onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'chat' ? 'text-neon bg-neon/10 border border-neon/20' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                <Sparkles className="w-4 h-4" /> Coach IA
              </button>
              <button 
                onClick={() => { setActiveTab('agendamento'); setMobileMenuOpen(false); }}
                className={`ml-4 px-4 py-2.5 bg-neon hover:bg-neon/90 text-black font-semibold text-xs rounded-lg uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-neon/20 flex items-center gap-2`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Aula Grátis
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-gray-950/95"
            >
              <div className="px-2 pt-2 pb-4 space-y-1">
                <button 
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'home' ? 'text-neon bg-white/5' : 'text-gray-300'}`}
                >
                  Início
                </button>
                <button 
                  onClick={() => { setActiveTab('treinos'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'treinos' ? 'text-neon bg-white/5' : 'text-gray-300'}`}
                >
                  Criador de Treino
                </button>
                <button 
                  onClick={() => { setActiveTab('calculadoras'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'calculadoras' ? 'text-neon bg-white/5' : 'text-gray-300'}`}
                >
                  Calculadoras Fitness
                </button>
                <button 
                  onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium ${activeTab === 'chat' ? 'text-neon bg-white/5' : 'text-gray-300'}`}
                >
                  📊 Coach Virtual IA
                </button>
                <button 
                  onClick={() => { setActiveTab('agendamento'); setMobileMenuOpen(false); }}
                  className={`w-full text-center px-3 py-3 bg-neon text-black rounded-lg text-base font-bold uppercase tracking-wider`}
                >
                  Agendar Aula Grátis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* COMPONENT ROOT WORKSPACE */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pb-20"
            >
              {/* HERO SECTION */}
              <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background image with precise overlay styles */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={heroBackground} 
                    alt="Espaço Elite Personal Trainer" 
                    className="w-full h-full object-cover object-center scaling-slow"
                    referrerPolicy="no-referrer"
                  />
                  {/* Premium contrast gradient mask overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/75 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712]/50"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 border border-neon/30 bg-neon/10 backdrop-blur-md rounded-full text-neon text-xs font-semibold tracking-wider uppercase mb-6"
                  >
                    <Award className="w-3.5 h-3.5" /> Resultados Rápidos, Seguros e Duradouros
                  </motion.div>

                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
                  >
                    FORÇA NÃO SE GANHA.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-lime-300 to-emerald-400">
                      SE CONSTRÓI!
                    </span>
                  </motion.h1>

                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-2xl mx-auto text-gray-300 text-lg sm:text-xl mb-10 leading-relaxed font-light"
                  >
                    Transforme seu físico e eleve seu desempenho com treinos hiper-personalizados focados em biomecânica de precisão, postura corrigida e periodização inteligente.
                  </motion.p>

                  <motion.div 
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4"
                  >
                    <button 
                      onClick={() => setActiveTab('treinos')}
                      className="w-full sm:w-auto px-8 py-4 bg-neon hover:bg-neon/90 text-black font-bold rounded-xl shadow-lg shadow-neon/20 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      Montar Meu Treino <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('agendamento')}
                      className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-neon bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Agendar Consulta Grátis
                    </button>
                  </motion.div>

                  {/* Highlights Grid */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 text-left border-t border-white/5 pt-10"
                  >
                    <div className="p-3">
                      <p className="text-neon font-mono text-3xl font-extrabold">+500</p>
                      <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Vidas Transformadas</p>
                    </div>
                    <div className="p-3">
                      <p className="text-neon font-mono text-3xl font-extrabold">100%</p>
                      <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Treinos Customizados</p>
                    </div>
                    <div className="p-3">
                      <p className="text-neon font-mono text-3xl font-extrabold">-24ton</p>
                      <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Gordura Eliminada</p>
                    </div>
                    <div className="p-3">
                      <p className="text-neon font-mono text-3xl font-extrabold">9.9/10</p>
                      <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Índice Avaliação</p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* QUICK ASSESSMENT BANNER OR ONBOARDING QUIZ */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-neon/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {quizStep === 0 && !showQuizResult ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-neon uppercase tracking-wider font-mono">Dagnóstico Fitness Rápido</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Qual o melhor treino para você hoje?</h2>
                        <p className="text-gray-400 max-w-xl text-sm sm:text-base">
                          Responda 3 perguntas rápidas para que nosso sistema analise suas metas e sugira o caminho perfeito para sua evolução física.
                        </p>
                      </div>
                      <button 
                        onClick={() => setQuizStep(1)}
                        className="px-6 py-3.5 bg-white/5 hover:bg-neon hover:text-black border border-white/10 hover:border-neon font-bold text-sm rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        Começar Análise <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : showQuizResult ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-neon/10 text-neon flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Diagnóstico Concluído com Sucesso!</h3>
                      <p className="text-gray-300 max-w-2xl mx-auto text-sm mb-6">
                        Análise de perfil: nível <strong className="text-neon">{quizAnswers.level}</strong> para <strong className="text-neon">{quizAnswers.goal}</strong> sugerida! O treinador preparou um plano especial que já está carregado para você.
                      </p>
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => { setActiveTab('treinos'); handleGenerateWorkout(); }}
                          className="px-6 py-2.5 bg-neon text-black font-bold text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Ir Para O Meu Treino Gerado
                        </button>
                        <button 
                          onClick={resetQuiz}
                          className="px-6 py-2.5 bg-white/5 text-gray-300 font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                        >
                          Refazer Teste
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-mono text-neon font-bold uppercase">Pergunta {quizStep} de 3</span>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-neon transition-all" style={{ width: `${(quizStep / 3) * 100}%` }}></div>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                        {quizQuestions[quizStep - 1].title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quizQuestions[quizStep - 1].options.map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => handleQuizAnswer(quizQuestions[quizStep - 1].key, opt.val)}
                            className="p-5 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon rounded-xl font-semibold text-sm transition-all text-white hover:scale-102 cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* TRAINER BIO SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column Profile Image with dynamic accents */}
                  <div className="lg:col-span-5 relative group">
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-neon via-emerald-400 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all"></div>
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-white/10">
                      <img 
                        src={trainerLucas} 
                        alt="Coach Lucas Silva" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Overlay badge with experience overlay */}
                      <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Nível de Certificação</p>
                          <p className="font-extrabold text-sm text-neon">CREF 093842-G/SP</p>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="text-right">
                          <p className="font-extrabold text-white text-sm">PRO COACH</p>
                          <p className="text-[10px] text-gray-400 font-mono">GOLD STANDARD</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Core Values & Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Seu Treinador</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Lucas Silva: Biomecânica de Alta Performance
                    </h2>
                    <p className="text-gray-300 leading-relaxed font-light">
                      Não acredito em treinos exaustivos focados em dor ou fórmulas mágicas. Meu método combina o melhor da ciência esportiva com análise postural para otimizar suas repetições. Você trabalha o músculo de forma inteligente, evitando desgaste articular e progredindo constantemente de carga.
                    </p>

                    {/* Quick credentials details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-neon/10 text-neon flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Graduado em Ed. Física</h4>
                          <p className="text-xs text-gray-400">Especialização em Fisiologia do Exercício.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-neon/10 text-neon flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">+8 Anos de Bagagem</h4>
                          <p className="text-xs text-gray-400">Atuação em academias boutique e reabilitação.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-neon/10 text-neon flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Biomecânica & Postura</h4>
                          <p className="text-xs text-gray-400">Prescrição focada em simetria e sem lesões.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-neon/10 text-neon flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Consultoria de Nutrição</h4>
                          <p className="text-xs text-gray-400">Suporte integral para ganhos limpos e definição.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-neon italic text-sm font-semibold">
                        "Seu maior oponente é você mesmo há trinta dias. Vamos trabalhar para vencê-lo!"
                      </p>
                    </div>
                  </div>

                </div>
              </section>

              {/* INTERACTIVE BEFORE/AFTER SLIDER SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
                <div className="text-center mb-12">
                  <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Resultados Comprovados</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                    Evolução Real e Visível
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mt-2">
                    Arraste o cursor/slider sobre a imagem de nossos alunos para conferir os resultados de treinos focados de alta consistência.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8">
                  {/* Selector controls */}
                  <div className="lg:col-span-5 space-y-4">
                    <p className="text-xs text-neon uppercase font-bold tracking-wider font-mono">Casos de Sucesso</p>
                    <div className="flex flex-col gap-2">
                      {testimonialsData.map((t, idx) => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveTestimonialIndex(idx); setSliderPosition(50); }}
                          className={`p-4 text-left rounded-2xl border transition-all cursor-pointer ${activeTestimonialIndex === idx ? 'bg-neon/10 border-neon/30 text-white' : 'bg-transparent border-white/5 hover:border-white/10 text-gray-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm sm:text-base">{t.name}, {t.age} anos</span>
                            <span className="text-xs font-mono font-bold text-neon bg-black/40 px-2 py-0.5 rounded-full">{t.result}</span>
                          </div>
                          <p className="text-xs mt-1 text-gray-400 font-mono tracking-wide">{t.role}</p>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 text-gray-300 text-xs italic leading-relaxed relative">
                      <span className="text-4xl opacity-10 absolute top-1 left-2 select-none">“</span>
                      <p className="pl-6 relative z-10">{testimonialsData[activeTestimonialIndex].quote}</p>
                    </div>
                  </div>

                  {/* Interactive Slider Area */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    <div 
                      ref={sliderRef}
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize select-none"
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleTouchMove}
                    >
                      {/* AFTER IMAGE (Background - fully visible, shown on the left) */}
                      <img 
                        src={testimonialsData[activeTestimonialIndex].afterImage} 
                        alt="Depois"
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* After indicator badge */}
                      <div className="absolute top-4 right-4 z-20 bg-neon text-black font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider font-mono uppercase">
                        Depois
                      </div>

                      {/* BEFORE IMAGE (Foreground - clipped inside state based on slider position) */}
                      <div 
                        className="absolute inset-0 z-10 select-none pointer-events-none"
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                      >
                        <img 
                          src={testimonialsData[activeTestimonialIndex].beforeImage} 
                          alt="Antes"
                          className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-75"
                          referrerPolicy="no-referrer"
                        />
                        {/* Before indicator badge */}
                        <div className="absolute top-4 left-4 z-20 bg-[#030712] text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider font-mono border border-white/10 uppercase">
                          Antes
                        </div>
                      </div>

                      {/* Draggable Divider Bar Line */}
                      <div 
                        className="absolute top-0 bottom-0 z-30 w-1 bg-neon shadow-lg flex items-center justify-center select-none pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center shadow-lg font-bold text-xs shrink-0 select-none">
                          ↔
                        </div>
                      </div>
                    </div>
                    
                    {/* Manual scroll bar proxy indicator */}
                    <div className="w-full mt-4 flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-mono select-none">Antes</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                        className="flex-1 accent-neon cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                      />
                      <span className="text-xs text-neon font-mono select-none">Depois</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* QUICK CTA ROW */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="bg-gradient-to-r from-neon/15 to-[#0f172a] rounded-3xl p-8 sm:p-12 border border-neon/10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Quer treinar presencialmente ou ter consultoria on-line?</h3>
                    <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
                      Garanta uma das vagas limitadas para acompanhamento completo de treinos, dieta, monitoramento e suporte direto no WhatsApp.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('agendamento')}
                    className="px-8 py-4 bg-neon hover:bg-neon/90 text-black font-extrabold rounded-xl shrink-0 tracking-wider shadow-lg hover:scale-102 transition-all cursor-pointer"
                  >
                    BORA AGENDAR! 💪
                  </button>
                </div>
              </section>

            </motion.div>
          )}

          {/* DYNAMIC WORKOUT CREATOR & LIVE TRACKER */}
          {activeTab === 'treinos' && (
            <motion.div 
              key="treinos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <div className="text-center mb-10">
                <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Periodização Inteligente</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Gerador Automático de Treinos
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mt-2">
                  Escolha suas metas e o algoritmo montará sua planilha de treino ideal com orientações detalhadas de execução executadas pelo Coach.
                </p>
              </div>

              {/* Form de geração */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Lateral Configurator panel */}
                <div className="lg:col-span-4 glass rounded-3xl p-6 border border-white/5 space-y-6">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2 border-b border-white/5 pb-3">
                    <Dumbbell className="w-5 h-5 text-neon" /> Prescrever Treino
                  </h3>

                  {/* Goal Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Objetivo Principal</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Hipertrofia', 'Emagrecimento', 'Resistência'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGoal(g)}
                          className={`py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all ${selectedGoal === g ? 'bg-neon text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Focus Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Foco Muscular</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Corpo Todo', 'Membros Superiores', 'Membros Inferiores', 'Cardio / Funcional'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFocus(f)}
                          className={`py-2.5 px-3 rounded-lg text-xs font-semibold text-center transition-all ${selectedFocus === f ? 'bg-neon text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experince Level Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nível de Condicionamento</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Iniciante', 'Intermediário', 'Avançado'].map((l) => (
                        <button
                          key={l}
                          onClick={() => setSelectedLevel(l as any)}
                          className={`py-2 rounded-lg text-xs font-semibold text-center transition-all ${selectedLevel === l ? 'bg-neon/20 text-neon border border-neon/30' : 'bg-white/5 text-gray-300'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleGenerateWorkout}
                    className="w-full py-4 bg-neon hover:bg-neon/90 text-black font-extrabold rounded-xl transition-all shadow-md uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    Gerar Roteiro de Treino <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Main exercises plan panel */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Rest timer active bar in workout view */}
                  <AnimatePresence>
                    {timerActive && (
                      <motion.div 
                        id="rest-timer-anchor"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 rounded-3xl bg-lime-950/40 border border-neon/30 text-center flex flex-col items-center justify-center relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 bottom-0 bg-neon/5 transition-all" style={{ width: `${(timeRemaining / timerMax) * 100}%` }}></div>
                        <span className="text-xs font-mono font-bold text-neon uppercase tracking-widest mb-1.5">Intervalo de Recuperação Ativo</span>
                        <h4 className="text-4xl font-mono font-extrabold text-white mb-2">{timeRemaining} <span className="text-sm">segundos</span></h4>
                        
                        <div className="flex items-center gap-2 relative z-10">
                          <button 
                            onClick={() => setTimerActive(!timerActive)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {timerActive ? 'Pausar' : 'Retomar'}
                          </button>
                          <button 
                            onClick={() => { setTimerActive(false); setTimeRemaining(0); }}
                            className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Pular Descanso
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                      <div>
                        <span className="text-xs font-bold text-neon font-mono uppercase">Rotina Carregada</span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans mt-0.5">{currentProgram.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">{currentProgram.description}</p>
                      </div>
                      
                      {!workoutStarted ? (
                        <button
                          onClick={handleStartWorkout}
                          className="px-5 py-2.5 bg-neon hover:bg-neon/90 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" /> Iniciar Treino
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-lime-400 font-bold px-2 py-1 bg-lime-500/10 rounded-lg">ATIVO</span>
                          <button
                            onClick={() => setWorkoutStarted(false)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            Resetar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Check if exercise list or show instruction */}
                    <div className="space-y-4">
                      {currentProgram.exercises.map((ex, idx) => {
                        const isCompleted = completedExercises[ex.name];
                        const isActive = workoutStarted && activeExerciseIndex === idx;

                        return (
                          <div 
                            key={ex.name}
                            className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-white/5 border-neon/50' : isCompleted ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-transparent border-white/5'} flex flex-col sm:flex-row items-start justify-between gap-4`}
                          >
                            <div className="flex items-start gap-3.5">
                              {/* Exercise check trigger */}
                              {workoutStarted ? (
                                <button
                                  onClick={() => toggleExerciseComplete(ex.name)}
                                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/30 text-transparent hover:border-neon'}`}
                                >
                                  ✓
                                </button>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400 shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                              )}
                              <div>
                                <h4 className={`font-bold text-sm sm:text-base ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                                  {ex.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1 max-w-xl">{ex.description}</p>
                                
                                {/* Exercise Specs Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="text-[10px] font-mono bg-white/5 text-gray-300 px-2 py-0.5 rounded-md border border-white/5">{ex.reps}</span>
                                  <span className="text-[10px] font-mono bg-white/5 text-gray-300 px-2 py-0.5 rounded-md border border-white/5">{ex.sets} séries</span>
                                  <span className="text-[10px] font-mono bg-neon/10 text-neon px-2 py-0.5 rounded-md border border-neon/10">Descanso: {ex.restTime}s</span>
                                </div>
                              </div>
                            </div>

                            {/* Rest timer activator button */}
                            {workoutStarted && (
                              <button
                                onClick={() => startRestTimer(ex.restTime, idx)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer text-left flex items-center gap-1.5 ${timerActive && activeExerciseIndex === idx ? 'bg-neon text-black' : 'bg-white/5 hover:bg-neon hover:text-black border border-white/10 hover:border-amber-400 text-gray-300'}`}
                              >
                                <Clock className="w-3.5 h-3.5" /> Descansar {ex.restTime}s
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Performance Finish Button */}
                    {workoutStarted && (
                      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-400 font-mono">
                          Progresso atual: <strong className="text-neon">{Object.values(completedExercises).filter(Boolean).length} de {currentProgram.exercises.length}</strong> exercícios completados.
                        </p>
                        
                        <button
                          onClick={() => {
                            alert("Treino concluído! Excelente empenho! Continue firme nessa pegada nos próximos dias! 💪");
                            setWorkoutStarted(false);
                            setCompletedExercises({});
                          }}
                          className="px-6 py-3 bg-neon hover:bg-neon/90 text-black font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg cursor-pointer"
                        >
                          Concluir Treino de Hoje! ⭐
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* DYNAMIC FITNESS CALCULATORS */}
          {activeTab === 'calculadoras' && (
            <motion.div 
              key="calculadoras"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <div className="text-center mb-10">
                <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Metabolismo sob Controle</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Central de Métricas Biométricas
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mt-2">
                  Monitore seus valores importantes como IMC, Gasto Calórico total e consumo de água para estruturar sua rotina de acordo com a ciência.
                </p>
              </div>

              {/* Grid content of tools */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* IMC & Gasto Calórico left controls */}
                <div className="lg:col-span-4 glass rounded-3xl p-6 border border-white/5 space-y-6">
                  <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3 uppercase tracking-wider text-xs font-mono text-neon">
                    Configurar Dados Corporais
                  </h3>

                  {/* Gender select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gênero Biológico</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setGender('masculino')}
                        className={`py-2 rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${gender === 'masculino' ? 'bg-neon text-black' : 'bg-white/5'}`}
                      >
                        Masculino
                      </button>
                      <button
                        onClick={() => setGender('feminino')}
                        className={`py-2 rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${gender === 'feminino' ? 'bg-neon text-black' : 'bg-white/5'}`}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>

                  {/* Weight slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-400">Peso</span>
                      <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded-md">{weight} kg</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="150" 
                      step="1"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="w-full accent-neon cursor-pointer"
                    />
                  </div>

                  {/* Height slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-400">Altura</span>
                      <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded-md">{height} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="130" 
                      max="220" 
                      step="1"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full accent-neon cursor-pointer"
                    />
                  </div>

                  {/* Age slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-400">Idade</span>
                      <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded-md">{age} anos</span>
                    </div>
                    <input 
                      type="range" 
                      min="14" 
                      max="85" 
                      step="1"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="w-full accent-neon cursor-pointer"
                    />
                  </div>

                  {/* Activity multiplier select */}
                  <div className="space-y-2 block">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Nível de Atividade</label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-neon text-white"
                    >
                      <option value="1.2">Sedentário (Pouco ou nenhum exercício)</option>
                      <option value="1.375">Levemente Ativo (Exercícios leves 1-3 dias/semana)</option>
                      <option value="1.55">Moderadamente Ativo (Treinos diários consistentes)</option>
                      <option value="1.725">Altamente Ativo (Treino pesado diário / trabalho físico)</option>
                    </select>
                  </div>
                </div>

                {/* Main dynamic outcomes panel */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* IMC Outcomes Card */}
                  <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 relative">
                    <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                       Apreciação do IMC (Índice de Massa Corporal)
                    </h3>

                    {/* Graphical range pointer scale */}
                    <div className="relative mb-6">
                      <div className="w-full h-4 bg-gradient-to-r from-amber-400 via-lime-400 to-red-500 rounded-full flex overflow-hidden">
                        {/* Sub ranges colored indicators */}
                        <div className="h-full w-[40%] bg-amber-400/20 flex items-center justify-center text-[10px] font-bold text-amber-300">Abaixo</div>
                        <div className="h-full w-[35%] bg-lime-400/20 flex items-center justify-center text-[10px] font-bold text-lime-400 border-l border-r border-white/10">Saudável</div>
                        <div className="h-full w-[25%] bg-red-400/20 flex items-center justify-center text-[10px] font-bold text-red-400">Alto</div>
                      </div>
                      
                      {/* Interactive needle representing BMI */}
                      <div 
                        className="absolute -top-1 w-1 bg-white h-6 shadow-xl transition-all duration-300"
                        style={{ left: `${Math.min(98, Math.max(2, ((imc - 15) / 25) * 100))}%` }}
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-neon flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-mono">Seu IMC Atual</p>
                        <p className="text-5xl font-mono font-extrabold text-neon mt-1">{imc.toFixed(1)}</p>
                        <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono mt-3 ${getImcLevel(imc).bg} ${getImcLevel(imc).color}`}>
                          {getImcLevel(imc).label}
                        </span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-neon" /> Recomendação de Biomecânica
                        </h4>
                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                          {getImcLevel(imc).desc} Treinamentos personalizados com Lucas atacam diretamente essa zona de peso corporal de forma biomecanicamente sadia.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metabolic Rate Outcomes Card (TDEE) */}
                  <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-neon" /> Gasto Energético Diário (TDEE)
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                        Esta é a estimativa aproximada de calorias recomendadas ingeridas diariamente apenas para manter seu peso corporal estável, baseada na rotina selecionada.
                      </p>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-400 font-mono">META DE MANUTENÇÃO</p>
                        <h4 className="text-3xl font-mono font-extrabold text-white mt-1">{tdee} <span className="text-sm">kcal/dia</span></h4>
                      </div>
                    </div>

                    {/* Weight objectives recommendation column */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest font-mono border-b border-white/5 pb-2">Planos de Ingestão de Acordo com Seus Objetivos</p>
                      
                      <div className="flex justify-between items-center p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <div>
                          <p className="text-xs font-bold">Déficit de Emagrecimento</p>
                          <p className="text-[10px] text-gray-400">Perca gordura sem queimar massa muscular</p>
                        </div>
                        <span className="font-mono font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg">{tdee - 500} kcal</span>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <div>
                          <p className="text-xs font-bold">Superávit de Hipertrofia</p>
                          <p className="text-[10px] text-gray-400">Ganho sólido de músculos com o treino do Lucas</p>
                        </div>
                        <span className="font-mono font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg">{tdee + 350} kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* Water Hydration Tracker Card */}
                  <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                          <Droplet className="w-5 h-5 text-[#38bdf8]" /> Monitor de Hidratação Diária
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Sua meta ideal calculada é de: <strong className="text-[#38bdf8] font-mono">{(weight * 35 / 1000).toFixed(2)} Litros</strong> de água/dia.</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-white/5 p-1 rounded-xl">
                        <button 
                          onClick={() => adjustWater(-1)} 
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-mono font-bold text-sm text-[#38bdf8]">{waterDrunk} copos</span>
                        <button 
                          onClick={() => adjustWater(1)} 
                          className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 flex items-center justify-center font-bold text-[#38bdf8] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8">
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                          {/* calculated target multiplier proportion */}
                          <div 
                            className="bg-sky-500 h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (waterDrunk * 0.25 / (weight * 35 / 1000)) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-2 text-gray-400">
                          <span>Registrado: {(waterDrunk * 0.25).toFixed(2)}L</span>
                          <span>Meta calculada: {(weight * 35 / 1000).toFixed(2)}L</span>
                        </div>
                      </div>

                      <div className="md:col-span-4 p-4 rounded-xl bg-sky-950/20 text-sky-300 border border-sky-400/15 text-xs text-center leading-relaxed">
                        💪 A água transporta o oxigênio para as fibras musculares! Beba água durante seus descansos de treino.
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* CHATBOT ARTIFICIAL INTELLIGENT COACH CONSULTANCY */}
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col min-h-[75vh]"
            >
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Atendimento Premium</span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                  Mentor de Performance IA: Coach Lucas
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  Tire suas dúvidas técnicas sobre agachamentos, supino, quantidade de proteínas, jejum ou peça auxílio na execução perfeita com inteligência de ponta.
                </p>
              </div>

              {/* Chat frame */}
              <div className="glass rounded-3xl border border-white/5 flex flex-col flex-1 h-[600px] overflow-hidden">
                
                {/* Header branding */}
                <div className="bg-slate-900/60 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neon">
                        <img 
                          src={trainerLucas} 
                          alt="Lucas Silva" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-lime-500 rounded-full border-2 border-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">Coach Lucas Silva (IA)</h3>
                      <p className="text-[10px] text-lime-400 font-bold uppercase tracking-wider">Atendimento Ativo</p>
                    </div>
                  </div>
                  
                  <span className="hidden sm:inline bg-neon/10 text-neon text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-neon/15">
                    Consultoria Privada
                  </span>
                </div>

                {/* Inner bubble space */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {chatMessages.map((msg) => {
                    const isUser = msg.role === 'user';
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isUser ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-lime-500 border-lime-300 text-black'}`}>
                          {isUser ? <User className="w-4.5 h-4.5" /> : <Dumbbell className="w-4 h-4" />}
                        </div>

                        {/* Content text */}
                        <div className={`p-4 rounded-2xl ${isUser ? 'bg-indigo-600/20 text-white border border-indigo-500/25 rounded-tr-none' : 'bg-[#0f172a] text-gray-200 border border-white/5 rounded-tl-none'} shadow-sm`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line text-left">{msg.content}</p>
                          <span className="block text-[10px] text-gray-400 font-mono mt-1 text-right">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing animation block */}
                  {chatLoading && (
                    <div className="flex gap-3.5 mr-auto max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-lime-500 border border-lime-300 text-black flex items-center justify-center shrink-0">
                        <Dumbbell className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-4 rounded-2xl bg-[#0f172a] border border-white/5 rounded-tl-none flex items-center gap-1">
                        <span className="text-xs text-gray-400 italic">Coach Lucas está digitando</span>
                        <span className="animate-bounce inline-block w-1 h-1 bg-neon rounded-full" />
                        <span className="animate-bounce delay-75 inline-block w-1 h-1 bg-neon rounded-full" />
                        <span className="animate-bounce delay-150 inline-block w-1 h-1 bg-neon rounded-full" />
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Input block form */}
                <form 
                  onSubmit={handleSendMessage}
                  className="bg-slate-900/60 border-t border-white/5 p-4 flex gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Mande sua dúvida: 'Como perder gordura?' ou 'Qual melhor treino para peito?'..."
                    className="flex-grow py-3 px-4 rounded-xl bg-gray-950 border border-white/10 text-white text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                  />
                  <button 
                    type="submit"
                    className="w-12 h-12 bg-neon hover:bg-neon/90 text-black rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-103 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4 fill-black" />
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* BOOKING CALENDAR SYSTEM */}
          {activeTab === 'agendamento' && (
            <motion.div 
              key="agendamento"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
              <div className="text-center mb-10">
                <span className="text-xs font-bold text-neon uppercase tracking-widest font-mono">Sua Primeira Consulta de Graça</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Agendar Avaliação Física & Aula Experimental
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mt-2">
                  Escolha o melhor dia e horário para que o treinador faça sua análise antropométrica, postural e prescreva seu primeiro planejamento estruturado.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form column */}
                <div className="lg:col-span-5 glass rounded-3xl p-6 sm:p-8 border border-white/5 space-y-4">
                  <h3 className="font-extrabold text-white text-lg border-b border-white/5 pb-3 flex items-center gap-2">
                    <Calendar className="text-neon w-5 h-5" /> Reservar Minha Vaga
                  </h3>

                  {bookingSuccess && (
                     <div className="p-4 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">
                       ✓ Reserva solicitada com sucesso! Coach Lucas entrará em contato via WhatsApp/Email para confirmar a liberação do seu acesso experimental de 1 hora! 💪
                     </div>
                  )}

                  <form onSubmit={handleCreateBooking} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seu Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Ex: Roberto Mezini"
                        className="w-full py-2.5 px-3 rounded-lg bg-gray-950 border border-white/10 text-white text-sm focus:outline-none focus:border-neon"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Email para Confirmação</label>
                      <input 
                        type="email" 
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="Ex: roberto@gmail.com"
                        className="w-full py-2.5 px-3 rounded-lg bg-gray-950 border border-white/10 text-white text-sm focus:outline-none focus:border-neon"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Escolher Data</label>
                        <input 
                          type="date" 
                          required
                          value={bookingDate}
                          min={new Date().toISOString().split('T')[0]} // Block previous dates
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full py-2.5 px-3 rounded-lg bg-gray-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Horário</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full py-2.5 px-3 rounded-lg bg-gray-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon"
                        >
                          <option value="06:00">06:00 am (Madrugador)</option>
                          <option value="08:00">08:00 am</option>
                          <option value="10:00">10:00 am</option>
                          <option value="12:00">12:00 pm (Almoço)</option>
                          <option value="14:00">14:00 pm</option>
                          <option value="16:00">16:00 pm</option>
                          <option value="18:00">18:00 pm (Pico)</option>
                          <option value="20:00">20:00 pm</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Seu Foco no Momento</label>
                      <select
                        value={bookingGoal}
                        onChange={(e) => setBookingGoal(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-lg bg-gray-950 border border-white/10 text-white text-xs focus:outline-none"
                      >
                        <option value="Hipertrofia">Ganhar Massa e Biomecânica</option>
                        <option value="Emagrecimento">Queima Ativa e Cardio</option>
                        <option value="Postural">Fortalecimento Postural e Lombar</option>
                        <option value="Condicionamento">Funcional e Flexibilidade</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 bg-neon hover:bg-neon/90 text-black font-extrabold rounded-xl text-xs tracking-wider uppercase transition-transform hover:scale-[1.01] cursor-pointer shadow-lg"
                    >
                      Confirmar Solicitação de Aula Grátis 💪
                    </button>
                  </form>
                </div>

                {/* Bookings viewer column */}
                <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="font-extrabold text-white text-lg">Suas Consultas Cadastradas</h3>
                    <span className="text-xs font-bold text-neon uppercase font-mono tracking-widest">{bookings.length} agendadas</span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 space-y-2">
                       <Clock className="w-10 h-10 text-white/10 mx-auto" />
                       <p className="text-sm font-semibold text-white">Nenhum treino experimental reservado.</p>
                       <p className="text-xs max-w-sm mx-auto p-4 bg-white/5 rounded-xl">Preencha o formulário ao lado para carregar sua reserva experimental direto no seu navegador!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div 
                          key={booking.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-all"
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#38bdf8]/10 text-[#38bdf8] px-2.5 py-0.5 rounded-full border border-[#38bdf8]/15 mb-2 inline-block">
                              Avaliação {booking.goal} Confirme
                            </span>
                            <h4 className="font-bold text-white text-base mt-1">{booking.name}</h4>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-mono">
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-neon" /> {booking.date}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-neon" /> {booking.timeSlot}h</span>
                            </div>
                          </div>

                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                          >
                            Desmarcar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Operational hours notice */}
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400 space-y-2">
                    <p className="font-bold text-white">Horário de funcionamento do Studio Lucas Elite:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Segunda a Sexta: 06:00 às 22:00</li>
                      <li>Sábado: 08:00 às 13:00</li>
                      <li>Domingo e Feriados: Fechamento Técnico (Descanse!)</li>
                    </ul>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-950/90 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-lg text-white tracking-widest uppercase">LUCAS SILVA ELITE</span>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Periodização inteligente de exercícios, biomecânica clínica de movimento, suporte motivacional e acompanhamento nutricional premium.
              </p>
            </div>

            {/* Quick links shortcuts */}
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-white mb-3">Links do Workspace</h4>
              <div className="flex flex-col gap-2 text-xs text-gray-400 font-medium">
                <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="text-left hover:text-neon transition">Apresentação</button>
                <button onClick={() => { setActiveTab('treinos'); setMobileMenuOpen(false); }} className="text-left hover:text-neon transition">Prescrição de Exercícios</button>
                <button onClick={() => { setActiveTab('calculadoras'); setMobileMenuOpen(false); }} className="text-left hover:text-neon transition">Calculadoras IMC & TDEE</button>
                <button onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }} className="text-left hover:text-neon transition">Consultoria Virtual Coach IA</button>
              </div>
            </div>

            {/* Certification and legal */}
            <div className="text-xs text-gray-400 space-y-2">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-white mb-2">Suporte & Legislação</h4>
              <p>CREF 093842-G/SP – Membro Ativo do Conselho Federal de Educação Física.</p>
              <p className="text-[10px] text-gray-500">Desenvolvido com carinho para AI Studio. Todos os direitos reservados © 2026.</p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
