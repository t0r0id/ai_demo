import {auth} from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/shared/constants";
import { checkSubscription } from "./subscription";

export const incrementApiCount = async () => {
    const {userId} = auth();
    if (!userId) return;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {  userId },
        select: { count: true },
    });
    if (userApiLimit){
    await prismadb.userApiLimit.update({
        where: { userId },
        data: { count: userApiLimit.count + 1 },
    });
    } else {
        await prismadb.userApiLimit.create({
            data: { userId, count: 1 },
        });
    }
}

export const checkApiLimit = async () => {
    const isPro = await checkSubscription();
    if (isPro) return true;
    const {userId} = auth();
    if (!userId) return false;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {  userId },
        select: { count: true },
    });
    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true
    }else{
        return false;
    }
};

export const getApiCount = async () => {
    const {userId} = auth();
    if (!userId) return 0;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {  userId },
        select: { count: true },
    });
    if (!userApiLimit) return 0;
    return userApiLimit.count;
}