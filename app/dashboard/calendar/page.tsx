'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
  MoreVertical,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'order' | 'meeting' | 'deadline' | 'blocked';
  client?: string;
  description?: string;
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Order ORD-2024-001 Due', date: '2024-01-22', time: '17:00', duration: '1h', type: 'deadline', client: 'Tech Startup Inc.' },
  { id: '2', title: 'Client Meeting', date: '2024-01-23', time: '10:00', duration: '1h', type: 'meeting', client: 'Innovation Labs', description: 'Discuss CAD design requirements' },
  { id: '3', title: 'Order ORD-2024-002 Due', date: '2024-01-20', time: '17:00', duration: '1h', type: 'deadline', client: 'Juan Dela Cruz' },
  { id: '4', title: 'Equipment Maintenance', date: '2024-01-25', time: '09:00', duration: '4h', type: 'blocked', description: '3D printer maintenance and calibration' },
  { id: '5', title: 'Order ORD-2024-004 Due', date: '2024-01-25', time: '17:00', duration: '1h', type: 'deadline', client: 'Innovation Labs' },
  { id: '6', title: 'Client Call', date: '2024-01-19', time: '14:00', duration: '30m', type: 'meeting', client: 'Electronics Plus' },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const availabilitySlots = [
  { day: 'Monday', slots: ['09:00 - 12:00', '13:00 - 18:00'], available: true },
  { day: 'Tuesday', slots: ['09:00 - 12:00', '13:00 - 18:00'], available: true },
  { day: 'Wednesday', slots: ['09:00 - 12:00', '13:00 - 18:00'], available: true },
  { day: 'Thursday', slots: ['09:00 - 12:00', '13:00 - 18:00'], available: true },
  { day: 'Friday', slots: ['09:00 - 12:00', '13:00 - 17:00'], available: true },
  { day: 'Saturday', slots: ['10:00 - 14:00'], available: true },
  { day: 'Sunday', slots: [], available: false },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [availability, setAvailability] = useState(availabilitySlots);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '09:00',
    duration: '1h',
    type: 'meeting' as CalendarEvent['type'],
    client: '',
    description: '',
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = formatDateString(day);
    return events.filter((e) => e.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
    setEventForm({ ...eventForm, date: dateStr });
  };

  const handleAddEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...eventForm,
    };
    setEvents([...events, newEvent]);
    setIsEventDialogOpen(false);
    setEventForm({
      title: '',
      date: '',
      time: '09:00',
      duration: '1h',
      type: 'meeting',
      client: '',
      description: '',
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setAvailability(
      availability.map((slot, i) =>
        i === dayIndex ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-500';
      case 'meeting':
        return 'bg-emerald-500';
      case 'deadline':
        return 'bg-red-500';
      case 'blocked':
        return 'bg-gray-500';
      default:
        return 'bg-accent';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date(today.toISOString().split('T')[0]))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Set Availability
          </Button>
          <Button onClick={() => setIsEventDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dateEvents = day ? getEventsForDate(day) : [];
                const dateStr = day ? formatDateString(day) : '';
                const isSelected = dateStr === selectedDate;

                return (
                  <div
                    key={index}
                    className={cn(
                      'min-h-24 p-1 border rounded-lg transition-colors cursor-pointer',
                      day ? 'hover:bg-muted/50' : 'bg-muted/20',
                      isSelected && 'border-accent bg-accent/5',
                      isToday(day || 0) && 'border-accent'
                    )}
                    onClick={() => day && handleDateClick(day)}
                  >
                    {day && (
                      <>
                        <div
                          className={cn(
                            'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                            isToday(day) && 'bg-accent text-accent-foreground'
                          )}
                        >
                          {day}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dateEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                'text-xs px-1 py-0.5 rounded truncate text-white',
                                getEventTypeColor(event.type)
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dateEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground px-1">
                              +{dateEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Deadline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Order</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm text-muted-foreground">Blocked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={cn('w-1 h-full rounded-full self-stretch', getEventTypeColor(event.type))} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{event.date}</span>
                          <Clock className="w-3 h-3 ml-1" />
                          <span>{event.time}</span>
                        </div>
                        {event.client && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            <span>{event.client}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Availability */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availability.map((slot) => (
                  <div
                    key={slot.day}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-lg',
                      slot.available ? 'bg-emerald-500/10' : 'bg-muted'
                    )}
                  >
                    <span className={cn('text-sm', !slot.available && 'text-muted-foreground')}>
                      {slot.day}
                    </span>
                    {slot.available ? (
                      <span className="text-xs text-muted-foreground">
                        {slot.slots.join(', ')}
                      </span>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsAvailabilityDialogOpen(true)}
              >
                Edit Availability
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteEvent(selectedEvent.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Badge className={cn('text-white', getEventTypeColor(selectedEvent.type))}>
                  {selectedEvent.type}
                </Badge>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.time} ({selectedEvent.duration})</span>
                  </div>
                  {selectedEvent.client && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEvent.client}</span>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={eventForm.duration}
                  onValueChange={(value) => setEventForm({ ...eventForm, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="all-day">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value) =>
                    setEventForm({ ...eventForm, type: value as CalendarEvent['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client (optional)</Label>
              <Input
                value={eventForm.client}
                onChange={(e) => setEventForm({ ...eventForm, client: e.target.value })}
                placeholder="Client name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Add notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={!eventForm.title || !eventForm.date}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Weekly Availability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {availability.map((slot, index) => (
              <div key={slot.day} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={slot.available}
                    onCheckedChange={() => toggleDayAvailability(index)}
                  />
                  <span className={cn(!slot.available && 'text-muted-foreground')}>
                    {slot.day}
                  </span>
                </div>
                {slot.available && (
                  <span className="text-sm text-muted-foreground">
                    {slot.slots.join(', ') || 'Set hours'}
                  </span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAvailabilityDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
