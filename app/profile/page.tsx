// app/profile/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';

export default function Profile() {
    const { user } = useAuth();
    const [tweets, setTweets] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            const fetchUserTweets = async () => {
                const res = await fetch(`/api/tweets?userId=${user.uid}`);
                const data = await res.json();
                setTweets(data);
            };
            fetchUserTweets();
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <h1>{user?.email}'s Profile</h1>
            <div className={styles.tweets}>
                <h2>Your Tweets</h2>
                {tweets.map(tweet => (
                    <div key={tweet.id} className={styles.tweet}>
                        <p>{tweet.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

