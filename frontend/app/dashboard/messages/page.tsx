'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'client';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
  fileName?: string;
}

interface Conversation {
  id: string;
  client: {
    name: string;
    avatar?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    client: { name: 'Tech Startup Inc.', online: true },
    lastMessage: 'Hi, can you give me an update on my order?',
    lastMessageTime: '5 min ago',
    unreadCount: 2,
    orderId: 'ORD-2024-001',
    messages: [
      { id: '1', content: 'Hello! I placed an order for PCB fabrication yesterday.', sender: 'client', timestamp: '10:30 AM' },
      { id: '2', content: 'Hi! Yes, I can see your order ORD-2024-001. We have received the files and are reviewing them now.', sender: 'me', timestamp: '10:35 AM', status: 'read' },
      { id: '3', content: 'Great! When do you think it will be ready?', sender: 'client', timestamp: '10:36 AM' },
      { id: '4', content: 'Based on the complexity, I estimate 5-7 business days. We will start production tomorrow.', sender: 'me', timestamp: '10:40 AM', status: 'read' },
      { id: '5', content: 'Perfect, thank you for the quick response!', sender: 'client', timestamp: '10:42 AM' },
      { id: '6', content: 'Hi, can you give me an update on my order?', sender: 'client', timestamp: '2:30 PM' },
    ],
  },
  {
    id: '2',
    client: { name: 'Juan Dela Cruz', online: false },
    lastMessage: 'The prototype looks great! Can we discuss modifications?',
    lastMessageTime: '1 hour ago',
    unreadCount: 1,
    orderId: 'ORD-2024-002',
    messages: [
      { id: '1', content: 'I received the 3D printed prototype today', sender: 'client', timestamp: '11:00 AM' },
      { id: '2', content: 'Great! How does it look?', sender: 'me', timestamp: '11:15 AM', status: 'read' },
      { id: '3', content: 'The prototype looks great! Can we discuss modifications?', sender: 'client', timestamp: '1:30 PM' },
    ],
  },
  {
    id: '3',
    client: { name: 'Maria Santos', online: true },
    lastMessage: 'Thank you for the quick turnaround!',
    lastMessageTime: '3 hours ago',
    unreadCount: 0,
    messages: [
      { id: '1', content: 'Hi, I just received my order. Everything looks perfect!', sender: 'client', timestamp: '9:00 AM' },
      { id: '2', content: 'That is wonderful to hear! Thank you for your feedback.', sender: 'me', timestamp: '9:15 AM', status: 'read' },
      { id: '3', content: 'Thank you for the quick turnaround!', sender: 'client', timestamp: '9:20 AM' },
      { id: '4', content: 'You are welcome! Feel free to reach out if you need anything else.', sender: 'me', timestamp: '9:25 AM', status: 'read' },
    ],
  },
  {
    id: '4',
    client: { name: 'Innovation Labs', online: false },
    lastMessage: 'Please send the revised design when ready',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    orderId: 'ORD-2024-004',
    messages: [
      { id: '1', content: 'We have reviewed your CAD requirements', sender: 'me', timestamp: 'Yesterday', status: 'read' },
      { id: '2', content: 'Perfect. Do you have any questions?', sender: 'client', timestamp: 'Yesterday' },
      { id: '3', content: 'A few clarifications on the dimensions - I will send detailed questions', sender: 'me', timestamp: 'Yesterday', status: 'read' },
      { id: '4', content: 'Please send the revised design when ready', sender: 'client', timestamp: 'Yesterday' },
    ],
  },
  {
    id: '5',
    client: { name: 'Electronics Plus', online: false },
    lastMessage: 'Looking forward to the next batch order',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    messages: [
      { id: '1', content: 'The 100 unit batch has been delivered successfully', sender: 'me', timestamp: '2 days ago', status: 'read' },
      { id: '2', content: 'Received! Quality is excellent as always.', sender: 'client', timestamp: '2 days ago' },
      { id: '3', content: 'Thank you! Let me know when you need the next batch.', sender: 'me', timestamp: '2 days ago', status: 'read' },
      { id: '4', content: 'Looking forward to the next batch order', sender: 'client', timestamp: '2 days ago' },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: 'Just now',
            }
          : conv
      )
    );

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
    });

    setNewMessage('');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileChat(true);
    // Mark as read
    setConversations(
      conversations.map((c) =>
        c.id === conv.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full overflow-hidden">
        <div className="flex h-full">
          {/* Conversations List */}
          <div
            className={cn(
              'w-full md:w-80 lg:w-96 border-r border-border flex flex-col',
              showMobileChat ? 'hidden md:flex' : 'flex'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                {totalUnread > 0 && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                    {totalUnread} unread
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-start gap-3',
                      selectedConversation?.id === conv.id && 'bg-muted'
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-accent/10 text-accent">
                          {conv.client.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.client.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn('font-medium truncate', conv.unreadCount > 0 && 'font-semibold')}>
                          {conv.client.name}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p
                          className={cn(
                            'text-sm truncate',
                            conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                          )}
                        >
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-accent text-accent-foreground h-5 min-w-5 flex items-center justify-center p-0">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {conv.orderId && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {conv.orderId}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              'flex-1 flex flex-col',
              !showMobileChat ? 'hidden md:flex' : 'flex'
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-accent/10 text-accent">
                        {selectedConversation.client.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.client.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedConversation.client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.client.online ? 'Online' : 'Offline'}
                      {selectedConversation.orderId && ` · ${selectedConversation.orderId}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <Video className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Info className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Order</DropdownMenuItem>
                        <DropdownMenuItem>Archive Chat</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.sender === 'me' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2',
                            message.sender === 'me'
                              ? 'bg-accent text-accent-foreground rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={cn(
                              'flex items-center justify-end gap-1 mt-1',
                              message.sender === 'me' ? 'text-accent-foreground/70' : 'text-muted-foreground'
                            )}
                          >
                            <span className="text-xs">{message.timestamp}</span>
                            {message.sender === 'me' && message.status && (
                              <>
                                {message.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
