import { JoinColumn, ManyToOne, Relation, Entity, Column } from 'typeorm';
import { SessionEntity } from './SessionEntity';
import { BaseEntity } from '../BaseEntity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
    @Column({ name: 'session_id', type: 'uuid' })
    public sessionId: string;

    @ManyToOne(() => SessionEntity, (session) => session.refreshTokens)
    @JoinColumn({ name: 'session_id' })
    public session: Relation<SessionEntity>;

    @Column({ type: 'varchar', unique: true, comment: 'sha256 hash' })
    public token: string;

    @Column({ name: 'expires_at', type: 'timestamp' })
    public expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    public revoked: boolean;
}
