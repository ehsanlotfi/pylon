
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using pylon.Data;

namespace pylon
{
    public class Program
    {
        public static void Main(string[] args)
        {
            
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<DatabaseContext>(p =>
             p.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}