interface AllUser {
    _id: string;
    name: string;
    publicProfile: string;
    userName: string;
    badgeCount: number;
    points: number;
}

interface User {
    name: string;
    publicProfile: string;
    profile: {
        userName: string,
        avatar: string,
        member: string,
    },
    league: {
        title: string,
        body: string,
        points: number,
        image: string,
    },
    badges: {
        title: string,
        earned: string,
        time: Date,
        image: string,
    }[]
}