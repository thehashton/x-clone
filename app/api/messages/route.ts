// app/api/messages/route.ts
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { senderId, receiverId, content } = await req.json();
    const message = await addDoc(collection(db, 'messages'), {
        senderId,
        receiverId,
        content,
        createdAt: new Date(),
    });
    return NextResponse.json(message, { status: 201 });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const chatUserId = searchParams.get('chatUserId');
    const q = query(
        collection(db, 'messages'),
        where('senderId', 'in', [userId, chatUserId]),
        where('receiverId', 'in', [userId, chatUserId]),
        orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(messages, { status: 200 });
}

