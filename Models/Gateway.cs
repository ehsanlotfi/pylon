using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace pylon.Models
{
    public class StoredProcedureInfo
    {
        public string Url { get; set; }
        public List<SqlParameterInfo> Model { get; set; }
    }

    public class SqlParameterInfo
    {
        public string ParameterName { get; set; }
        public string ParameterType { get; set; }
    }
}
