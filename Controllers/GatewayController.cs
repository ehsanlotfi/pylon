using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using pylon.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
                if (!IsHealthyConnection(connection))
                {
                    return StatusCode(422, "Connection is wrong!");
                }

                string StoredProcedureName = "sps_" + path;

                if(CheckStoredProcedure(connection, StoredProcedureName))
                {
                    using (SqlCommand command = new SqlCommand("sps_" + path, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        if(inputModel != null)
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
                } else
                {
                    return NotFound();
                }
            }

            return Ok(results);
        }

        [HttpGet("api/list")]
        public IActionResult GetStoredProcedures()
        {
            List<StoredProcedureInfo> procedureInfoList = new List<StoredProcedureInfo>();

            using (SqlConnection connection = new SqlConnection(_config["ConnectionStrings:ApiConnection"]))
            {
                if(!IsHealthyConnection(connection))
                {
                    return StatusCode(422, "Connection is wrong!");
                }

                DataTable schemaTable = connection.GetSchema("Procedures");

                foreach (DataRow row in schemaTable.Rows)
                {
                    string procedureName = row["ROUTINE_NAME"].ToString();
                    List<SqlParameterInfo> parameters = GetStoredProcedureParameters(connection, procedureName);


                    List<Dictionary<string, object>> model = new List<Dictionary<string, object>>();

                    Dictionary<string, object> modelItem = new Dictionary<string, object>();
                    for (int i = 0; i < parameters.Count; i++)
                    {
                        modelItem.Add(parameters[i].ParameterName.Substring(1), MapSqlTypeToTypeScriptType(parameters[i].ParameterType));
                    }

                    model.Add(modelItem);

                    StringBuilder Url = new StringBuilder();
                    Url.Append(_config["Site:Origin"]);
                    Url.Append("api/");
                    Url.Append(procedureName.Substring(4));

                    procedureInfoList.Add(new StoredProcedureInfo
                    {
                        Url = Url.ToString(),
                        Model = model
                    });
                }
            }

            return Ok(procedureInfoList);
        }

        private List<SqlParameterInfo> GetStoredProcedureParameters(SqlConnection connection, string procedureName)
        {
            List<SqlParameterInfo> parameterInfoList = new List<SqlParameterInfo>();

            DataTable schemaTable = connection.GetSchema("ProcedureParameters", new string[] { null, null, procedureName });

            foreach (DataRow row in schemaTable.Rows)
            {
                string parameterName = row["PARAMETER_NAME"].ToString();
                string parameterType = row["DATA_TYPE"].ToString();

                parameterInfoList.Add(new SqlParameterInfo
                {
                    ParameterName = parameterName,
                    ParameterType = parameterType
                });
            }

            return parameterInfoList;
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

        private static bool IsHealthyConnection(SqlConnection connection)
        {
                try
                {
                    connection.Open();
                    return true;
                }
                catch (SqlException)
                {
                    return false;
                }
        }

    }
}