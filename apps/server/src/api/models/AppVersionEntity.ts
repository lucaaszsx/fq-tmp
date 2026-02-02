/**
 * @file AppVersion.entity.ts
 * @description Entity representing application version metadata stored in PostgreSQL. Contains version information, changelog, download URLs, and lifecycle timestamps. Maps to the app_versions table in the database.
 * @author Lucas
 * @license Apache-2.0
 */

import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    Column,
    Index
} from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUrl, Matches } from 'class-validator';

@Entity('app_versions')
@Index(['version'], { unique: true })
@Index(['isActive'])
export class AppVersion {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d+\.\d+\.\d+$/, {
        message: 'Version must follow semantic versioning format (e.g., 1.0.0)'
    })
    version!: string;

    @Column({ type: 'integer' })
    @IsNumber()
    versionCode!: number;

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    changelog?: string;

    @Column({ type: 'varchar', length: 500 })
    @IsString()
    @IsNotEmpty()
    r2Key!: string;

    @Column({ type: 'varchar', length: 1024 })
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    downloadUrl!: string;

    @Column({ type: 'bigint' })
    @IsNumber()
    fileSize!: number;

    @Column({ type: 'varchar', length: 64, nullable: true })
    @IsString()
    @IsOptional()
    checksum?: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isActive!: boolean;

    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    isPreRelease!: boolean;

    @Column({ type: 'integer', default: 0 })
    @IsNumber()
    downloadCount!: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;
}