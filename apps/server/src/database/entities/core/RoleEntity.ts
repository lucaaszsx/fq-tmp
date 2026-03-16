import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { UserEntity } from './UserEntity';
import { RoleRules } from '@fc/core';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: RoleRules.NAME.MAX_LENGTH,
        unique: true
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: RoleRules.DESCRIPTION.MAX_LENGTH
    })
    description!: string;

    @Column({ type: 'bigint', default: 0 })
    permissions!: string;

    @OneToMany(() => UserEntity, (user) => user.role)
    public users!: UserEntity[];
}
