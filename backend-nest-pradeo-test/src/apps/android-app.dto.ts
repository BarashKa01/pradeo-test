import { User } from "src/users/user.entity";

export class AndroidAppDto {
    id: number;
    name: string;
    hash: string;
    comment: string;
    is_safe: boolean;
    is_verified: boolean;
    report_id: string;
    on_upload: boolean;
    user: User;

}