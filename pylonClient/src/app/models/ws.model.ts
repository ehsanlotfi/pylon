export class WSModel
{
    id: number = 0;
    type: string = "StoreProcedure"; // SQLQuery, StoreProcedure, Service
    title: string = "";
    name: string = "";
    service: string = "";
    category: string = "";
    method: string = "POST"; // POST, GET, PUT, PATCH, DELETE, HEAD, OPTION
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
    status: string = "Draft"; // Draft, Published, Remove
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
