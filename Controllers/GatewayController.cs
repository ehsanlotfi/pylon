using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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


        private bool CheckStoredProcedure(SqlConnection connection, string storedProcedureName)
        {
            using (SqlCommand checkCommand = new SqlCommand("SELECT COUNT(*) FROM sys.objects WHERE type = 'P' AND name = @storedProcedureName", connection))
            {
                checkCommand.Parameters.AddWithValue("@storedProcedureName", storedProcedureName);

                int count = (int)checkCommand.ExecuteScalar();

                return count > 0;
            }
        }

        [HttpPost("api/{*path}")]
        public IActionResult Get(string path)
        {
            List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();

            using (SqlConnection connection = new SqlConnection(_config["ConnectionStrings:DefaultConnection"]))
            {
                connection.Open();
                string StoredProcedureName = path.Replace("-", "_");

                if(CheckStoredProcedure(connection, StoredProcedureName))
                {
                    using (SqlCommand command = new SqlCommand(path.Replace("-", "_"), connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

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
                } else
                {
                    return NotFound();
                }
            }

            return Ok(results);
        }

    }
}