import { JoinColumn, ManyToOne, OneToMany, Column, Entity, Index } from 'typeorm';
import { SessionEntity } from './SessionEntity';
import { BaseEntity } from '../BaseEntity';
import { RoleEntity } from './RoleEntity';
import { UserRules } from '@fc/core';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @Column({
        name: 'full_name',
        type: 'varchar',
        length: UserRules.NAME.MAX_LENGTH
    })
    public fullName: string;

    @Column({
        type: 'varchar',
        length: UserRules.EMAIL.MAX_LENGTH,
        unique: true
    })
    public email: string;

    @Column({
        type: 'varchar',
        length: UserRules.PASSWORD.MAX_LENGTH,
        select: false
    })
    public password: string;

    @Column({ name: 'role_id', type: 'uuid', nullable: true })
    @Index('idx_users_role_id')
    public roleId: string | null;

    @ManyToOne(() => RoleEntity, (role) => role.users, {
        nullable: true
    })
    @JoinColumn({ name: 'role_id' })
    public role: RoleEntity | null;

    @Column({ name: 'is_active', default: true })
    public isActive: boolean;

    @OneToMany(() => SessionEntity, (session) => session.user)
    public sessions: SessionEntity[];
}
