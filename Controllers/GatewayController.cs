using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using pylon.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace gateway.Controllers
{
    [ApiController]
    public class GatewayController : ControllerBase
    {
        private readonly IConfiguration _config;

        public GatewayController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("api/{*path}")]
        public IActionResult Get(string path, [FromBody] Dictionary<string, object>? inputModel)
        {
            List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();

            using (SqlConnection connection = new SqlConnection(_config["ConnectionStrings:ApiConnection"]))
            {
                string Healthy = IsHealthyConnection(connection);
                if (Healthy != "ok")
                {
                    return StatusCode(422, Healthy);
                }

                string StoredProcedureName = "sps_" + path;

                if (CheckStoredProcedure(connection, StoredProcedureName))
                {
                    using (SqlCommand command = new SqlCommand("sps_" + path, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        if (inputModel != null)
                        {
                            foreach (var kvp in inputModel)
                            {
                                command.Parameters.AddWithValue("@" + kvp.Key, kvp.Value.ToString());
                            }
                        }

                        try
                        {
                            using (SqlDataReader reader = command.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    Dictionary<string, object> result = new Dictionary<string, object>();

                                    for (int i = 0; i < reader.FieldCount; i++)
                                    {
                                        string columnName = reader.GetName(i);
                                        object columnValue = reader.GetValue(i);
                                        result.Add(columnName, columnValue);
                                    }

                                    results.Add(result);
                                }
                            }
                        }
                        catch (System.Exception)
                        {

                            return StatusCode(405, "Params is wrong!");
                        }
                    }
                }
                else
                {
                    return NotFound();
                }
            }

            return Ok(results);
        }

        [HttpGet("api/list")]
        [ProducesResponseType(typeof(OpenApiDocument), 200)]
        public async Task<IActionResult> GetStoredProceduresAsync()
        {
            var openApiDoc = new OpenApiDocument
            {
                Info = new OpenApiInfo { Title = "Stored Procedures API", Version = "v1" },
                Paths = new OpenApiPaths()
            };

            List<StoredProcedureInfo> procedureInfoList = new List<StoredProcedureInfo>();

            using (SqlConnection connection = new SqlConnection(_config["ConnectionStrings:ApiConnection"]))
            {
                string Healthy = IsHealthyConnection(connection);
                if (Healthy != "ok")
                {
                    return StatusCode(422, Healthy);
                }

                List<StoredProcedure> storedProcedures = await GetStoredProceduresAsync(connection);

                List<string> storedProceduresUniq = storedProcedures.Select(item => item.ProcedureName)
                                    .Distinct()
                                    .ToList();


                foreach (var procedure in storedProceduresUniq)
                {
                    var operation = new OpenApiOperation
                    {
                        Summary = $"Execute stored procedure {procedure}",
                        Description = $"Execute stored procedure {procedure}",
                        Responses = new OpenApiResponses
                        {
                            ["200"] = new OpenApiResponse
                            {
                                Description = "Successful operation"
                            }
                        }
                    };

                    //Add parameters to the operation
                    foreach (var parameter in storedProcedures.Where(x => x.ProcedureName == procedure))
                    {
                        operation.Parameters.Add(new OpenApiParameter
                        {
                            Name = parameter.ParameterName,
                            In = ParameterLocation.Query,
                            Required = true,
                            Schema = new OpenApiSchema { Type = parameter.ParameterType }
                        });
                    }

                    // Add operation to the path
                    openApiDoc.Paths.Add($"/api/{procedure.ToLower()}", new OpenApiPathItem
                    {
                        Operations = new Dictionary<OperationType, OpenApiOperation>
                        {
                            [OperationType.Get] = operation
                        }
                    });
                }

            }

            return Ok(openApiDoc);

        }

        public static async Task<List<StoredProcedure>> GetStoredProceduresAsync(SqlConnection connection)
        {
            string query = @"
            SELECT 
                p.name AS ProcedureName,
                pp.name AS ParameterName,
                t.name AS ParameterType
            FROM 
                sys.procedures p
            JOIN 
                sys.parameters pp ON p.object_id = pp.object_id
            JOIN
                sys.types t ON pp.system_type_id = t.system_type_id
            WHERE 
                p.name LIKE 'sps_%' AND t.name <> 'sysname'";
            return (await connection.QueryAsync<StoredProcedure>(query)).AsList();
        }

        public class SqlParameterInfo
        {
            public string ParameterName { get; set; }
            public string ParameterType { get; set; }
        }


        private bool CheckStoredProcedure(SqlConnection connection, string storedProcedureName)
        {
            using (SqlCommand checkCommand = new SqlCommand("SELECT COUNT(*) FROM sys.objects WHERE type = 'P' AND name = @storedProcedureName", connection))
            {
                checkCommand.Parameters.AddWithValue("@storedProcedureName", storedProcedureName);

                int count = (int)checkCommand.ExecuteScalar();

                return count > 0;
            }
        }

        private static readonly Dictionary<string, string> TypeMapping = new Dictionary<string, string>
            {
                { "bigint", "number" },
                { "binary", "Uint8Array" },
                { "bit", "boolean" },
                { "char", "string" },
                { "date", "Date" },
                { "datetime", "Date" },
                { "decimal", "number" },
                { "float", "number" },
                { "int", "number" },
                { "money", "number" },
                { "nchar", "string" },
                { "ntext", "string" },
                { "numeric", "number" },
                { "nvarchar", "string" },
                { "real", "number" },
                { "smalldatetime", "Date" },
                { "smallint", "number" },
                { "smallmoney", "number" },
                { "text", "string" },
                { "time", "Date" },
                { "timestamp", "Date" },
                { "tinyint", "number" },
                { "uniqueidentifier", "string" },
                { "varbinary", "Uint8Array" },
                { "varchar", "string" },

            };

        private static string MapSqlTypeToTypeScriptType(string sqlType)
        {
            if (TypeMapping.TryGetValue(sqlType.ToLower(), out string tsType))
            {
                return tsType;
            }
            else
            {
                // Handle unsupported types or custom mappings here
                throw new NotSupportedException($"Mapping for SQL type '{sqlType}' to TypeScript type is not defined.");
            }
        }

        private static string IsHealthyConnection(SqlConnection connection)
        {
            try
            {
                connection.Open();
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

    }
}