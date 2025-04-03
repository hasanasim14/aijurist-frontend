export interface ChatMessage {
  user_query?: string | object;
  llm_response?: string | object;
  role?: string;
  content?: string;
  lookup?: any;
}

export interface ChatState {
  pastChat: ChatMessage[];
  currentMessages: ChatMessage[];
  input: string;
  isLoading: boolean;
  chatId: string | number;
  threadId: number;
  questionId: number;
  showSidebar: boolean;
  hasChatContent: boolean;
  showHeading: boolean;
}
