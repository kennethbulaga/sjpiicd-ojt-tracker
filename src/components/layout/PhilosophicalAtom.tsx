"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const PhilosophicalQuestions = [
  "Did you really lose the person, or did you lose the version of the future you imagined with them?",
  "When someone leaves your life, is the pain about losing them—or realizing you meant less to them than they meant to you?",
  "If someone truly loved you, would they ever put you in a position where you had to question it?",
  "Do people fall out of love suddenly, or do they slowly stop choosing each other?",
  "When a relationship ends, is closure something the other person gives—or something you eventually give yourself?",
  "What hurts more: making the wrong decision, or never knowing what could have happened if you tried?",
  "If you could go back to one moment in college and say what you were too afraid to say, would it change everything—or nothing at all?",
  "Are some regrets meant to stay with us so we grow, or are they just reminders of chances we were too scared to take?",
  "How many important moments in life pass quietly because we assumed there would always be another chance?",
  "When you think about your biggest regret, is it about something you did—or something you never had the courage to do?",
  "Are you actually unhappy right now, or just comparing your life to someone else’s highlight reel?",
  "Why do we sometimes only recognize the happiest moments of our lives after they’re already gone?",
  "If you suddenly lost everything you currently take for granted, how much of your life would you realize was already good?",
  "Is happiness something we build over time, or something we accidentally overlook while chasing bigger goals?",
  "Are we truly living our college years—or just surviving them until something better comes?",
  "Why can someone feel deeply lonely even when surrounded by classmates, friends, and people every day?",
  "Do people change in college because they discover who they are—or because they feel pressure to become someone new?",
  "How many friendships are real connections, and how many are just shared convenience and proximity?",
  "If everyone around you suddenly disappeared tomorrow, would you still know who you are without them?",
  "Are we afraid of being alone—or afraid of discovering what we feel when we finally are?",
  "If the people you care about knew your deepest thoughts, would they see you the same way?",
  "How many opportunities in your life disappeared simply because you hesitated?",
  "Are you chasing the life you actually want, or the life you think you're supposed to want?",
  "If you stopped trying so hard to prove yourself, would anyone notice?",
  "Are you afraid of failing, or afraid of discovering you never truly tried?",
  "How many people in your life truly know the real version of you?",
  "Are the goals you're chasing yours—or expectations you inherited from others?",
  "If everything stayed exactly the same for the next five years, would you be satisfied with where you are?",
  "Are you becoming the person your younger self hoped you'd be?",
  "How much of your life is built on choices you made, and how much is built on choices you avoided?",
  "If you disappeared from everyone's life tomorrow, who would actually come looking for you?",
  "Are you happy right now, or just distracted enough not to think about it?",
  "How many times have you stayed silent when saying something might have changed everything?",
  "Are you living your life, or just waiting for your real life to start?",
  "If you could see the path your life will take, would it comfort you or scare you?",
  "Do people really change, or do they just get better at hiding who they've always been?",
  "How much of your personality is real, and how much is a defense mechanism?",
  "If your life were a story, would you admire the character you’ve become?",
  "Are you afraid of being alone—or afraid of what you’ll realize when you are?",
  "When was the last time you felt truly understood by someone?",
  "Did you actually lose them, or did you lose the version of the future you imagined with them?",
  "If someone truly loved you, would they ever leave you questioning where you stand?",
  "When someone stops choosing you, is it harder to accept the loss or the rejection?",
  "Are situationships confusing because feelings are complicated, or because honesty is missing?",
  "Did they love you, or did they just love how you made them feel?",
  "If someone came back into your life right now, would you welcome them—or just reopen an old wound?",
  "How do you know when it's time to let someone go, even if you still care about them?",
  "Are we sometimes more attached to memories than to the actual person?",
  "When someone moves on quickly after a breakup, does it mean they cared less—or just healed differently?",
  "Do people fall out of love suddenly, or slowly stop choosing each other?",
  "If you had another chance with someone you loved, would it end differently—or the same way?",
  "Was it really love, or just two lonely people finding comfort in each other?",
  "Why do we sometimes fight harder for people who treat us worse?",
  "If someone doesn't see your worth, is the problem them—or the time you spent trying to prove it?",
  "Are we afraid of losing people, or afraid of feeling replaceable?",
  "Do we miss people themselves, or just the feeling of being important to them?",
  "If someone truly cared about you, would they make you feel like an option?",
  "Are we heartbroken because the love ended—or because the story didn't finish the way we imagined?",
  "Why do some people stay in our minds long after they’ve left our lives?",
  "If love requires effort from both people, why do so many relationships survive on one person trying harder?",
  "How much of your current path is something you chose, and how much is something you simply continued?",
  "If you removed everyone else's expectations, what kind of life would you actually want?",
  "Are you building the life you want—or the life that feels safest?",
  "What would you do differently if you weren't afraid of disappointing people?",
  "Are you growing into who you want to become, or drifting into whoever life turns you into?",
  "If your younger self saw you today, what would surprise them the most?",
  "At what point do you stop trying to become someone and start accepting who you are?",
  "How many decisions in your life were made out of passion, and how many out of fear?",
  "If success meant losing time with the people you love, would it still feel worth it?",
  "Are you chasing happiness, or just trying to avoid regret?",
  "How do you know if you're on the right path when no one truly knows the destination?",
  "If you could restart your college journey knowing everything you know now, what would you change?",
  "Are you trying to discover yourself, or trying to escape the version of yourself you don't like?",
  "What kind of person are you becoming through the choices you make every day?",
  "Are you proud of the habits that are shaping your future?",
  "How many years of your life have been spent waiting for the “right time”?",
  "Is success something you define for yourself, or something you inherited from society?",
  "What would your life look like if you stopped comparing your timeline to everyone else's?",
  "When people remember you years from now, what do you hope they remember most?",
  "If the next chapter of your life started tomorrow, what would you want it to look like?"
]

const SHOW_DURATION = 10000  // 10 seconds visible
const HIDE_DURATION = 20000  // 20 seconds hidden

export function PhilosophicalAtom({ className = "w-8 h-8" }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const showTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastIndexRef = useRef<number>(-1)

  // Pick a random question different from the last one shown
  const pickRandom = useCallback(() => {
    let idx: number
    do {
      idx = Math.floor(Math.random() * PhilosophicalQuestions.length)
    } while (idx === lastIndexRef.current && PhilosophicalQuestions.length > 1)
    lastIndexRef.current = idx
    return PhilosophicalQuestions[idx]
  }, [])

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  // Schedule: show message → hide after SHOW_DURATION → wait HIDE_DURATION → repeat
  const scheduleCycle = useCallback(() => {
    clearTimers()
    const msg = pickRandom()
    setMessage(msg)

    hideTimerRef.current = setTimeout(() => {
      setMessage(null)
      showTimerRef.current = setTimeout(scheduleCycle, HIDE_DURATION)
    }, SHOW_DURATION)
  }, [pickRandom, clearTimers])

  // Auto-start: first message appears after initial HIDE_DURATION delay
  useEffect(() => {
    showTimerRef.current = setTimeout(scheduleCycle, HIDE_DURATION)
    return clearTimers
  }, [scheduleCycle, clearTimers])

  // Manual click: show immediately and restart the cycle from this point
  const handleClick = useCallback(() => {
    scheduleCycle()
  }, [scheduleCycle])

  return (
    <div className="relative flex items-center justify-center">
      {/* Speech Bubble */}
      {message && (
        <div className="absolute top-[140%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[340px] rounded-xl bg-foreground/95 backdrop-blur-sm px-4 py-3.5 text-[11px] sm:text-xs leading-relaxed font-medium text-background shadow-xl animate-in fade-in slide-in-from-top-2 z-[60] text-center text-balance transition-all hover:bg-foreground hover:scale-105 duration-300">
          {message}
          {/* Arrow pointing up */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-foreground/95" />
        </div>
      )}

      {/* Atom Toggle */}
      <button
        type="button"
        onClick={handleClick}
        className="relative hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        aria-label="Interact for a philosophical thought"
      >
        <svg
          viewBox="0 0 1024 1024"
          className={`${className} drop-shadow-sm opacity-90 animate-[spin_10s_linear_infinite]`}
          aria-label="Philosophical Atom"
        >
          <path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" className="text-[#2F4BFF] dark:text-blue-400" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
