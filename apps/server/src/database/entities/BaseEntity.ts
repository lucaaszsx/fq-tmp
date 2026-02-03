import {
    PrimaryGeneratedColumn,
    CreateDateColumn
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz'
    })
    public createdAt!: Date;

    @CreateDateColumn({
        name: 'updated_at',
        type: 'timestamptz'
    })
    public updatedAt!: Date;
}