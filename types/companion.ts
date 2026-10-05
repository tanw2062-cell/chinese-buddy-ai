export interface Companion {
  id: string
  name: string
  title: string
  mood: string
  tags: string[]
  online: boolean
  accent: string
  greeting: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'companion'
  text: string
  time: string
}
