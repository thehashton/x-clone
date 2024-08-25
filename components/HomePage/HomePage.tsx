// app/home/HomePage.tsx
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import RightSidebar from '@/components/RightSidebar';
import styles from './HomePage.module.scss';

export default function HomePage() {
    return (
        <div className={styles.container}>
            <Sidebar avatarUrl={'https://randomuser.me/api/portraits/men/9.jpg'}/>
            <MainContent />
            <RightSidebar />
        </div>
    );
}
