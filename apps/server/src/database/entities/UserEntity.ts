import {
    JoinColumn,
    ManyToOne,
    Entity,
    Column,
    Index
} from 'typeorm';
import { RoleEntity } from './RoleEntity';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'users' })
@Index('IDX_USER_EMAIL_UNIQUE', ['email'], { unique: true })
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @Column({
        type: 'varchar',
        length: 180,
        unique: true
    })
    email!: string;

    @Column({
        type: 'varchar',
        length: 255,
        select: false
    })
    password!: string;

    @ManyToOne(() => RoleEntity, (role) => role.users, {
        nullable: false
    })
    @JoinColumn({ name: 'role_id' })
    public role!: RoleEntity;
}