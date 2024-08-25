// app/tweets/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';  // Ensure useAuth is properly set up
import styles from './Tweets.module.scss';

export default function Tweets() {
    const [tweets, setTweets] = useState<any[]>([]);
    const [newTweet, setNewTweet] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);  // Loading state
    const { user } = useAuth();

    // Check if the user is correctly authenticated
    useEffect(() => {
        console.log("Authenticated user:", user);
    }, [user]);

    // Fetch existing tweets when the component loads
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const res = await fetch('/api/tweets');
                const data = await res.json();
                setTweets(data);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        };
        fetchTweets();
    }, []);

    // Handle form submission to post a new tweet
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("New Tweet:", newTweet);
        console.log("User:", user);

        if (newTweet && user) {
            try {
                setIsSubmitting(true);  // Set loading state to true
                console.log("Submitting tweet...");
                await fetch('/api/tweets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newTweet, userId: user.uid }),
                });
                setNewTweet('');
                // Fetch updated tweets
                const res = await fetch('/api/tweets');
                const data = await res.json();
                setTweets(data);
            } catch (error) {
                console.error("Error submitting tweet:", error);
            } finally {
                setIsSubmitting(false);  // Set loading state to false after submission
            }
        } else {
            console.log("Tweet not submitted. Missing content or user.");
        }
    };

    // If the user is not authenticated, show a message
    if (!user) {
        return <p>Please log in to tweet.</p>;
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="What's happening?"
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    className={styles.input}
                    disabled={isSubmitting}  // Disable input during submission
                />
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Tweet'}
                </button>
            </form>
            <div className={styles.tweets}>
                {tweets.map(tweet => (
                    <div key={tweet.id} className={styles.tweet}>
                        <p>{tweet.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
