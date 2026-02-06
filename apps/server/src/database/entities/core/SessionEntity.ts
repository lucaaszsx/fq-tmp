import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { UserEntity } from "./UserEntity";

@Entity('sessions')
@Index(['token'])
@Index(['userId', 'isRevoked'])
export class SessionEntity extends BaseEntity {
    @Column({ unique: true })
    token!: string;

    @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column()
    userId!: string;

    @Column({ type: 'timestamp' })
    expiresAt!: Date;

    @Column({ default: false })
    isRevoked!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    revokedAt!: Date;

    @Column({ nullable: true })
    ipAddress!: string;

    @Column({ type: 'text', nullable: true })
    userAgent!: string;

    @Column({ nullable: true })
    deviceName!: string;

    @Column({ nullable: true })
    replacedByToken!: string;
}