import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  about: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'individual' | 'group';
  timestamp: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'read' | 'sent' | 'unread';
}

type State = {
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  selectedChatId: string | null;
  fromContacts: boolean;
  originalContact: Contact | null;
  initialMessageCount: number;
};

type Action =
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: { id: string; updates: Partial<Chat> } }
  | { type: 'SET_MESSAGES'; payload: { chatId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'SET_SELECTED_CHAT'; payload: string | null }
  | { type: 'SET_FROM_CONTACTS'; payload: { fromContacts: boolean; originalContact?: Contact; initialMessageCount?: number } }
  | { type: 'REMOVE_CHAT'; payload: string };

const initialState: State = {
  chats: [],
  messagesByChat: {},
  selectedChatId: null,
  fromContacts: false,
  originalContact: null,
  initialMessageCount: 0,
};

function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'ADD_CHAT':
      const newChats = [...state.chats, action.payload];
      return { ...state, chats: newChats.sort((a, b) => b.timestamp - a.timestamp) };
    case 'UPDATE_CHAT':
      const updatedChats = state.chats.map(chat =>
        chat.id === action.payload.id ? { ...chat, ...action.payload.updates } : chat
      );
      return { ...state, chats: updatedChats.sort((a, b) => b.timestamp - a.timestamp) };
    case 'SET_MESSAGES':
      return {
        ...state,
        messagesByChat: { ...state.messagesByChat, [action.payload.chatId]: action.payload.messages },
      };
    case 'ADD_MESSAGE':
      const updatedMessages = {
        ...state.messagesByChat,
        [action.payload.chatId]: [...(state.messagesByChat[action.payload.chatId] || []), action.payload.message],
      };
      return { ...state, messagesByChat: updatedMessages };
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChatId: action.payload };
    case 'SET_FROM_CONTACTS':
      return {
        ...state,
        fromContacts: action.payload.fromContacts,
        originalContact: action.payload.originalContact || null,
        initialMessageCount: action.payload.initialMessageCount || 0,
      };
    case 'REMOVE_CHAT':
      return {
        ...state,
        chats: state.chats.filter(chat => chat.id !== action.payload),
        messagesByChat: Object.fromEntries(
          Object.entries(state.messagesByChat).filter(([key]) => key !== action.payload)
        ),
        selectedChatId: state.selectedChatId === action.payload ? null : state.selectedChatId,
      };
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    // Load initial chats from mock data (as in index.tsx)
    const initialChats: Chat[] = [
      { 
        id: '1', 
        name: '+91 98765 43321', 
        lastMessage: 'See you tomorrow!', 
        time: '2:41 PM', 
        unread: 0, 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
        type: 'individual',
        timestamp: new Date('2025-10-09T14:41:00').getTime(),
      },
      { 
        id: '2', 
        name: '+91 70546 56468', 
        lastMessage: 'Sure, looking now.', 
        time: '2:49 PM', 
        unread: 2, 
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=60',
        type: 'individual',
        timestamp: new Date('2025-10-09T14:49:00').getTime(),
      },
      { 
        id: '3', 
        name: 'Sumit Kumar', 
        lastMessage: 'Meeting at 2 PM', 
        time: '1:42 PM', 
        unread: 0, 
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60',
        type: 'individual',
        timestamp: new Date('2025-10-09T13:42:00').getTime(),
      },
      { 
        id: '4', 
        name: 'Neha Khanna', 
        lastMessage: 'One more update.', 
        time: '09:46 AM', 
        unread: 3, 
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60',
        type: 'group',
        timestamp: new Date('2025-10-09T09:46:00').getTime(),
      },
      { 
        id: '5', 
        name: 'Raman Kumar', 
        lastMessage: 'Sure, how about Friday?', 
        time: '09:19 AM', 
        unread: 1, 
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
        type: 'individual',
        timestamp: new Date('2025-10-09T09:19:00').getTime(),
      },
      { 
        id: '6', 
        name: 'Kunal Desai', 
        lastMessage: 'Project update attached', 
        time: 'Yesterday', 
        unread: 0, 
        avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60',
        type: 'group',
        timestamp: new Date('2025-10-08T16:00:00').getTime(),
      },
      { 
        id: '7', 
        name: 'Krishna Thakur', 
        lastMessage: 'One more thing - update the doc.', 
        time: 'Yesterday', 
        unread: 3, 
        avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60',
        type: 'group',
        timestamp: new Date('2025-10-08T16:00:00').getTime(),
      }
    ];
    dispatch({ type: 'SET_CHATS', payload: initialChats });

    // Load initial messagesByChat from mock
    const initialMessagesByChat: Record<string, Message[]> = {
      '1': [
        { id: '1-1', text: 'Hey! How are you doing today?', sender: 'them', time: '10:30 AM', status: 'read' },
        { id: '1-2', text: "I'm good! Just working on some new designs. Want to grab coffee later?", sender: 'me', time: '10:32 AM', status: 'read' },
        { id: '1-3', text: 'Sure! That sounds great. What time works for you?', sender: 'them', time: '10:35 AM', status: 'read' },
        { id: '1-4', text: 'How about 3 PM at our usual spot?', sender: 'me', time: '10:36 AM', status: 'read' },
        { id: '1-5', text: 'Perfect! See you then 😊', sender: 'them', time: '10:37 AM', status: 'read' }
      ],
      '2': [
        { id: '2-1', text: 'Thanks for sending the files!', sender: 'them', time: '2:45 PM', status: 'read' },
        { id: '2-2', text: "You're welcome. Let me know if you need anything else.", sender: 'me', time: '2:47 PM', status: 'read' },
        { id: '2-3', text: 'One more thing - can you check the report?', sender: 'them', time: '2:48 PM', status: 'unread' },
        { id: '2-4', text: 'Sure, looking now.', sender: 'them', time: '2:49 PM', status: 'unread' }
      ],
      '3': [
        { id: '3-1', text: 'Meeting confirmed for tomorrow.', sender: 'them', time: '1:40 PM', status: 'read' },
        { id: '3-2', text: 'Great, see you there!', sender: 'me', time: '1:41 PM', status: 'read' }
      ],
      '4': [
        { id: '4-1', text: 'Updated project timeline - please review.', sender: 'them', time: '09:40 AM', status: 'read' },
        { id: '4-2', text: 'Looks good, but deadline seems tight.', sender: 'me', time: '09:42 AM', status: 'read' },
        { id: '4-3', text: 'Can we discuss in standup?', sender: 'them', time: '09:45 AM', status: 'unread' },
        { id: '4-4', text: 'Yes, added to agenda.', sender: 'them', time: '09:46 AM', status: 'unread' },
        { id: '4-5', text: 'One more update.', sender: 'them', time: '09:47 AM', status: 'unread' }
      ],
      '5': [
        { id: '5-1', text: 'Happy Birthday! 🎉 Hope you have a great day!', sender: 'them', time: '09:15 AM', status: 'unread' },
        { id: '5-2', text: "Thanks! Let's celebrate soon.", sender: 'me', time: '09:18 AM', status: 'read' },
        { id: '5-3', text: 'Sure, how about Friday?', sender: 'them', time: '09:19 AM', status: 'unread' }
      ],
      '6': [
        { id: '6-1', text: 'Project update attached - feedback needed.', sender: 'them', time: 'Yesterday 3:20 PM', status: 'read' },
        { id: '6-2', text: 'Received, will review tonight.', sender: 'me', time: 'Yesterday 3:22 PM', status: 'read' },
        { id: '6-3', text: 'Meeting notes shared with team.', sender: 'them', time: 'Yesterday 5:10 PM', status: 'read' }
      ],
      '7': [
        { id: '7-1', text: 'Quick call to discuss the issue?', sender: 'them', time: 'Yesterday 2:50 PM', status: 'read' },
        { id: '7-2', text: 'Yes, available now?', sender: 'me', time: 'Yesterday 2:52 PM', status: 'read' },
        { id: '7-3', text: 'In 10 mins.', sender: 'them', time: 'Yesterday 3:00 PM', status: 'unread' },
        { id: '7-4', text: 'Done, thanks!', sender: 'them', time: 'Yesterday 3:15 PM', status: 'unread' },
        { id: '7-5', text: 'One more thing - update the doc.', sender: 'them', time: 'Yesterday 4:00 PM', status: 'unread' }
      ]
    };
    Object.entries(initialMessagesByChat).forEach(([chatId, messages]) => {
      dispatch({ type: 'SET_MESSAGES', payload: { chatId, messages } });
    });
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};