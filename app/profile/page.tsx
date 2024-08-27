"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTweets = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/tweets?userId=${user.uid}`);

          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
          }

          const text = await res.text();
          const data = text ? JSON.parse(text) : [];

          setTweets(data);
        } catch (error: any) {
          console.error("Failed to fetch tweets:", error);
          setError("Failed to load tweets.");
        }
      }
    };

    fetchUserTweets();
  }, [user]);

  if (!user) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src="/path-to-banner-image.jpg" alt="Banner" />
        <div className={styles.editBanner}>Edit profile</div>
      </div>
      <div className={styles.profileInfo}>
        <img src="/path-to-avatar.jpg" alt="Avatar" className={styles.avatar} />
        <div className={styles.profileDetails}>
          <h1 className={styles.fullName}>{user.displayName || user.email}</h1>
          <p className={styles.username}>@{user.username || "guest"}</p>
          <p className={styles.bio}>No bio available</p>
          <p className={styles.location}>Location not set</p>
          <p className={styles.joined}>Joined Unknown</p>
        </div>
      </div>
      <div className={styles.tweetsSection}>
        <h2>Your Tweets</h2>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className={styles.tweet}>
              <p>{tweet.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.noTweets}>You haven't posted any tweets yet.</p>
        )}
      </div>
    </div>
  );
}
