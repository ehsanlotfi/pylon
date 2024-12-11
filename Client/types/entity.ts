import type { BasicStatus, PermissionType } from "./enum";

export interface UserToken
{
	accessToken?: string;
	refreshToken?: string;
}

export interface UserInfo
{
	id: string;
	email: string;
	username: string;
	password?: string;
	avatar?: string;
	role?: Role;
	status?: BasicStatus;
	permissions?: Permission[];
}

export interface IAGS
{
	Id: string | null;
	Type: 'SQLQuery' | 'StoreProcedure' | 'Service';
	Title: string;
	Name: string;
	Service: string;
	Category: string;
	Method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTION';
	IsQueryParams: boolean;
	Params: string;
	IsHeaders: boolean;
	Headers: string;
	IsFormData: boolean;
	IsPayload: boolean;
	Payloads: string;
	CacheTimeout: number;
	IsEnablead: boolean;
	Status: 'Draft' | 'Published' | 'Remove';
	SetUserParams: string | null;
	Description: string | null;
	Tags: string[];
	SampleInput: string | null;
	SampleOutput: string | null;
	Roles: string[];
	Version: string;
}

export interface Organization
{
	id: string;
	name: string;
	status: "enable" | "disable";
	desc?: string;
	order?: number;
	children?: Organization[];
}

export interface Permission
{
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: BasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: string;
	newFeature?: boolean;
	children?: Permission[];
}

export interface Role
{
	id: string;
	name: string;
	label: string;
	status: BasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission[];
}
