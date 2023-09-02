using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using pylon.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Services
{
    public class ContextSeedService
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;

        public ContextSeedService(
            DatabaseContext context,
            IConfiguration config,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }

        public async Task InitializeContextAsync()
        {
            if (_context.Database.GetPendingMigrationsAsync().GetAwaiter().GetResult().Count() > 0)
            {
                // applies any pending migration into our database
                await _context.Database.MigrateAsync();
            }

            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole { Name = _config["IDP:Role:Admin"] });
                await _roleManager.CreateAsync(new IdentityRole { Name = _config["IDP:Role:Editor"] });
                await _roleManager.CreateAsync(new IdentityRole { Name = _config["IDP:Role:Viewver"] });
            }

            if (!_userManager.Users.AnyAsync().GetAwaiter().GetResult())
            {
                var admin = new User
                {
                    FirstName = "admin",
                    LastName = "jackson",
                    UserName = _config["IDP:AdminUserName"],
                    Email = _config["IDP:AdminUserName"],
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(admin, "123456");
                await _userManager.AddToRolesAsync(admin, new[] { _config["IDP:Role:Admin"], _config["IDP:Role:Editor"], _config["IDP:Role:Viewver"] });
                await _userManager.AddClaimsAsync(admin, new Claim[]
                {
                    new Claim(ClaimTypes.Email, admin.Email),
                    new Claim(ClaimTypes.Surname, admin.LastName)
                });

                var manager = new User
                {
                    FirstName = "manager",
                    LastName = "wilson",
                    UserName = "manager@example.com",
                    Email = "manager@example.com",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(manager, "123456");
                await _userManager.AddToRoleAsync(manager, _config["IDP:Role:Editor"]);
                await _userManager.AddClaimsAsync(manager, new Claim[]
                {
                    new Claim(ClaimTypes.Email, manager.Email),
                    new Claim(ClaimTypes.Surname, manager.LastName)
                });

                var player = new User
                {
                    FirstName = "player",
                    LastName = "miller",
                    UserName = "player@example.com",
                    Email = "player@example.com",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(player, "123456");
                await _userManager.AddToRoleAsync(player, _config["IDP:Role:Viewver"]);
                await _userManager.AddClaimsAsync(player, new Claim[]
                {
                    new Claim(ClaimTypes.Email, player.Email),
                    new Claim(ClaimTypes.Surname, player.LastName)
                });

                var vipplayer = new User
                {
                    FirstName = "vipplayer",
                    LastName = "tomson",
                    UserName = "vipplayer@example.com",
                    Email = "vipplayer@example.com",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(vipplayer, "123456");
                await _userManager.AddToRoleAsync(vipplayer, _config["IDP:Role:Viewver"]);
                await _userManager.AddClaimsAsync(vipplayer, new Claim[]
                {
                    new Claim(ClaimTypes.Email, vipplayer.Email),
                    new Claim(ClaimTypes.Surname, vipplayer.LastName)
                });
            }
        }
    }
}
