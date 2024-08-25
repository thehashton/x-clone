// app/messages/[chatUserId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './Messages.module.scss';

export default function Messages({ params }: { params: { chatUserId: string } }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        if (user) {
            const fetchMessages = async () => {
                const res = await fetch(`/api/messages?userId=${user.uid}&chatUserId=${params.chatUserId}`);
                const data = await res.json();
                setMessages(data);
            };
            fetchMessages();
        }
    }, [user, params.chatUserId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage && user) {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage, senderId: user.uid, receiverId: params.chatUserId }),
            });
            setNewMessage('');
            // Fetch updated messages
            const res = await fetch(`/api/messages?userId=${user.uid}&chatUserId=${params.chatUserId}`);
            const data = await res.json();
            setMessages(data);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map(message => (
                    <div key={message.id} className={styles.message}>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Send</button>
            </form>
        </div>
    );
}

