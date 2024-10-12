using System;

namespace pylon.Models
{
    public enum WSType
    {
        StoreProcedure,
        SQLQuery,
        WEBService
    }

    public enum WSMethod
    {
        POST,
        GET,
        PUT,
        PATH,
        DELETE,
        HEAD,
        OPTION
    }

    public enum WSStatus
    {
        Remove,
        Draft,
        Published
    }

    public class WS
    {
        public int Id { get; set; }
        public WSType Type { get; set; }
        public string Name { get; set; }
        public string Service { get; set; }
        public string Category { get; set; }
        public WSMethod Method { get; set; } 
        public bool IsQueryParams { get; set; }
        public bool IsAuthentication { get; set; }
        public string Params { get; set; }
        public bool IsHeaders { get; set; }
        public string Headers { get; set; }
        public bool IsFormData { get; set; }
        public bool IsPayload { get; set; }
        public string Payloads { get; set; }
        public int CacheTimeout { get; set; }
        public bool IsEnablead { get; set; }
        public WSStatus Status { get; set; }
        public bool SetUserParams { get; set; }
        public int RateLimit { get; set; }
        public string Description { get; set; }
        public string Tags { get; set; }
        public string SampleInput { get; set; }
        public string SampleOutput { get; set; }
        public string Roles { get; set; }
        public string Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
    }
}
