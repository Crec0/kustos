export type UserObject = {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
    accountSince: string;
    relativeAge: string;
};

export type NameIdObject = {
    name: string;
    id: string;
};

export type Guild = NameIdObject;
export type Channel = NameIdObject;
export type Tag = NameIdObject;
