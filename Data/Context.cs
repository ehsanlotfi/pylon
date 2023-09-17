using pylon.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace pylon.Data
{
    public class Context : IdentityDbContext<User>
    {
        public Context(DbContextOptions<Context> options) :base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                const string TableNamePrefix = "AspNet";
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith(TableNamePrefix))
                    entityType.SetTableName(tableName.Substring(TableNamePrefix.Length));
            }
        }


    }
}
