using System;

namespace pylon.Models
{
    public class WS
    {
        public int Id { get; set; }
        public string Type { get; set; } // SQLQuery, StoreProcedure, Service
        public string Title { get; set; }
        public string Name { get; set; }
        public string Service { get; set; }
        public string Category { get; set; }
        public string Method { get; set; } // POST, GET, PUT, PATH, DELETE, HEAD, OPTION
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
        public string Status { get; set; } // Draft, Published, Remove
        public bool SetUserParams { get; set; }
        public int RateLimit { get; set; } // Request limit per minute/hour
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
