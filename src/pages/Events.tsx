import React from 'react';
import { MapPin, Clock, Plus, Users } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const mockEvents = [
    {
        id: 1,
        title: 'General Body Meeting',
        date: '15 Nov 2023',
        time: '10:00 AM',
        location: 'Main Hall',
        description: 'Annual general body meeting for all members to discuss yearly progress and future plans.',
        attendees: 150,
        status: 'Upcoming'
    },
    {
        id: 2,
        title: 'Islamic Class for Kids',
        date: 'Every Saturday',
        time: '09:00 AM',
        location: 'Madrasa Hall',
        description: 'Weekly Islamic studies class for children aged 5-12.',
        attendees: 45,
        status: 'Ongoing'
    },
    {
        id: 3,
        title: 'Eid Celebration Planning',
        date: '20 Oct 2023',
        time: '08:00 PM',
        location: 'Committee Room',
        description: 'Planning committee meeting for upcoming Eid celebrations.',
        attendees: 12,
        status: 'Completed'
    },
];

const Events: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
                    <p className="text-slate-500 mt-1">Schedule and manage community events.</p>
                </div>
                <Button icon={Plus}>Create Event</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockEvents.map((event) => (
                    <Card key={event.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant={
                                event.status === 'Upcoming' ? 'info' :
                                    event.status === 'Ongoing' ? 'success' : 'default'
                            }>
                                {event.status}
                            </Badge>
                            <div className="text-center bg-slate-50 rounded-lg p-2 min-w-[60px]">
                                <span className="block text-xs text-slate-500 uppercase font-bold">{event.date.split(' ')[1]}</span>
                                <span className="block text-xl font-bold text-slate-900">{event.date.split(' ')[0]}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 flex-1">{event.description}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center text-sm text-slate-600">
                                <Clock size={16} className="mr-2 text-emerald-500" />
                                {event.time}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <MapPin size={16} className="mr-2 text-emerald-500" />
                                {event.location}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <Users size={16} className="mr-2 text-emerald-500" />
                                {event.attendees} Expected
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" className="w-full">View Details</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Events;
