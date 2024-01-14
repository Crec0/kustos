import { db } from '$lib/server/database';
import Alea from 'alea';
import { eq } from 'drizzle-orm';
import { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';

const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const alea = Alea();

const pickRandomChars = () => {
    let chars = '';
    for (let i = 0; i < 8; i++) {
        chars += charList.charAt(Math.floor(alea.next() * 63));
    }
    return chars;
};

export const generateUniqueID = (table: SQLiteTable, idColumn: SQLiteColumn): string => {
    const uniqueID = pickRandomChars();
    const entry = db.select().from(table).where(eq(idColumn, uniqueID)).get();
    if (entry === undefined) {
        return uniqueID;
    }
    return generateUniqueID(table, idColumn);
};
