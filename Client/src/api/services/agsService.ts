import apiClient from "../apiClient";

import type { IAGS } from "#/entity";

export enum OrgApi
{
	Org = "/org",
}

const getAGSList = () => apiClient.get<IAGS[]>({ url: OrgApi.Org });

export default {
	getAGSList,
};
