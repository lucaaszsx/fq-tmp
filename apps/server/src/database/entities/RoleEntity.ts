import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from './UserEntity';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 15,
        unique: true
    })
    name!: string;

    @Column({ type: 'varchar', length: 250 })
    description!: string;

    @Column({ type: 'bigint', default: 0 })
    permissions!: string;

    @OneToMany(() => UserEntity, (user) => user.role)
    public users!: UserEntity[];
}