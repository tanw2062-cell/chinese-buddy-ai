import type { ChatMessage, Companion } from '~/types/companion'

const COMPANIONS: Companion[] = [
  {
    id: 'teacher-li',
    name: '李老师',
    title: 'Beginner Tutor',
    mood: 'Patient bilingual coaching',
    tags: ['HSK 1-3', 'Pinyin', 'Grammar'],
    online: true,
    accent: 'from-amber-300 to-rose-400',
    greeting: '你好！I am Teacher Li. We will go slowly: listen, repeat, then I will correct one sentence at a time.'
  },
  {
    id: 'buddy-wang',
    name: '老王',
    title: 'Beijing Culture Buddy',
    mood: 'Street Mandarin & daily life',
    tags: ['Slang', 'Food', 'Cities'],
    online: true,
    accent: 'from-red-400 to-orange-300',
    greeting: '嘿，我是老王。想练地道口语就来：点菜、吐槽地铁、聊聊游戏——我都会给你拼音和意思。'
  },
  {
    id: 'pro-master',
    name: '商务教练',
    title: 'Career Mandarin Coach',
    mood: 'Meetings, HSK, pronunciation',
    tags: ['Business', 'HSK 4-6', 'Accent'],
    online: true,
    accent: 'from-slate-200 to-red-500',
    greeting: 'Welcome. State your goal: a meeting opener, an email, or an HSK drill. I will model the line, then correct yours.'
  }
]

export const useCompanion = () => {
  const companions = useState<Companion[]>('tutors', () => COMPANIONS)
  const activeId = useState<string>('active-tutor-id', () => COMPANIONS[0].id)
  const stamina = useState<number>('practice-credits', () => 72)
  const staminaMax = 100
  const chats = useState<Record<string, ChatMessage[]>>('tutor-chats', () => ({}))

  const activeCompanion = computed(
    () => companions.value.find(item => item.id === activeId.value) ?? companions.value[0]
  )

  const activeMessages = computed(() => chats.value[activeCompanion.value.id] ?? [])

  const selectCompanion = (id: string) => {
    activeId.value = id
  }

  return {
    companions,
    stamina,
    staminaMax,
    activeId,
    activeCompanion,
    activeMessages,
    selectCompanion
  }
}
