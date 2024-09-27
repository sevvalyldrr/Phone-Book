export interface contact {
    id: number;
    name: string;
    surname?: string;
    phoneNumber?: string;
    companyName?: string;
    companyPhoneNumber?: string;
    email?: string;
    birthday?: Date | null;
    profileImage?: string;
    favourite: boolean;
}
