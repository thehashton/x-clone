// app/home/Tweet.tsx
import { FaRegComment, FaRetweet, FaRegHeart, FaShare } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import styles from "./Tweet.module.scss";
import { PiSealCheckFill } from "react-icons/pi";

interface TweetProps {
  avatarUrl: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  comments: number;
  retweets: number;
  likes: number;
}

export default function Tweet({
  avatarUrl,
  name,
  handle,
  time,
  content,
  comments,
  retweets,
  likes,
}: TweetProps) {
  return (
    <div className={styles.tweet}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className={styles.avatar} />
      <div className={styles.tweetContent}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          <span className={styles.handle}>
            @{handle} <PiSealCheckFill className={styles.verifiedIcon} />
          </span>
          <span className={styles.time}> · {time}</span>
          <FiMoreHorizontal className={styles.moreIcon} />
        </div>
        <div className={styles.body}>
          <p>{content}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.action}>
            <FaRegComment className={styles.icon} />
            <span>{comments}</span>
          </div>
          <div className={styles.action}>
            <FaRetweet className={styles.icon} />
            <span>{retweets}</span>
          </div>
          <div className={styles.action}>
            <FaRegHeart className={styles.icon} />
            <span>{likes}</span>
          </div>
          <div className={styles.action}>
            <FaShare className={styles.icon} />
          </div>
        </div>
      </div>
    </div>
  );
}
