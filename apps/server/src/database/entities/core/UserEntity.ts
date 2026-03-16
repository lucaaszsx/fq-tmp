import { JoinColumn, ManyToOne, OneToMany, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { RoleEntity } from './RoleEntity';
import { UserRules } from '@fc/core';
import { SessionEntity } from './SessionEntity';

@Entity({ name: 'users' })
@Index('IDX_USER_EMAIL_UNIQUE', ['email'], { unique: true })
export class UserEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: UserRules.NAME.MAX_LENGTH
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: UserRules.EMAIL.MAX_LENGTH,
        unique: true
    })
    email!: string;

    @Column({
        type: 'varchar',
        length: UserRules.PASSWORD.MAX_LENGTH,
        select: false
    })
    password!: string;

    @ManyToOne(() => RoleEntity, (role) => role.users, {
        nullable: false
    })
    @JoinColumn({ name: 'roleId' })
    public role!: RoleEntity;

    @Column()
    public roleId!: string;

    @Column({ default: true })
    public isActive!: boolean;

    @OneToMany(() => SessionEntity, (session) => session.user)
    sessions!: SessionEntity[];
}
