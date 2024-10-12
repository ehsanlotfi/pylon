export class WSModel
{
    id: number = 0;
    type: number = 0; // 0 = StoreProcedure, 1 = SQLQuery, 2 = WEBService
    name: string = "";
    service: string = "";
    category: string = "";
    method: number = 0; // 0 = POST, 1 = GET, 2 = PUT, 3 = PATCH, 4 = DELETE, 5 = HEAD, 6 = OPTION
    isQueryParams: boolean = false;
    isAuthentication: boolean = false;
    params: string = "";
    isHeaders: boolean = false;
    headers: string = "";
    isFormData: boolean = false;
    isPayload: boolean = false;
    payloads: string = "";
    cacheTimeout: number = 0;
    isEnablead: boolean = false;
    status: number = 1; // 0 = Remove, 1 = Draft, 2 = Published
    setUserParams: boolean = false;
    rateLimit: number = 0; // Request limit per minute/hour
    description: string = "";
    tags: string = "";
    sampleInput: string = "";
    sampleOutput: string = "";
    roles: string = "";
    version: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    createdUser: string = "";
    updatedUser: string = "";
}
