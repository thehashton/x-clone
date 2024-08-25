// app/api/tweets/route.ts
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const q = userId
        ? query(collection(db, 'tweets'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
        : query(collection(db, 'tweets'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tweets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(tweets, { status: 200 });
}

export async function POST(req: Request) {
    const { content, userId } = await req.json();
    const tweet = await addDoc(collection(db, 'tweets'), {
        content,
        userId,
        createdAt: new Date(),
    });
    return NextResponse.json(tweet, { status: 201 });
}
