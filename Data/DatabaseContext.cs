using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace pylon.Data
{
    public class DatabaseContext: IdentityDbContext<IdentityUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options) { 
        
        }
    }
}
