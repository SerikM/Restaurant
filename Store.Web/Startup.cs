using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Store.Data.Infrastructure;
using Store.Data.Interfaces;
using Store.BusinessServices.Interfaces;
using Store.BusinessServices.Implements;
using Store.Data.Repositories;

namespace Store.Web
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }
        

        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            var connStr = Configuration.GetConnectionString("StoreConnection").ToString();
            services.AddDbContext<StoreContext>(options => 
                options.UseSqlServer(connStr));

            services.AddMvc()
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver = 
                  new DefaultContractResolver());

            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
            services.AddTransient<IHomeService, HomeService>();
            services.AddTransient<IWhatsonService, WhatsonService>();
            services.AddTransient<IAdminService, AdminService>();
            services.AddTransient<IMenuService, MenuService>();
            services.AddTransient<IBookingService, BookingService>();
            services.AddTransient<IEmailService, EmailService>();
            //setting configuration
            services.AddSingleton<IConfiguration>(Configuration);

            services.Configure<IISOptions>(
                options =>  new IISOptions
                {
                    AutomaticAuthentication = true
                });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, /*ILoggerFactory loggerFactory,*/ StoreContext context)
        {
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                //app.UseBrowserLink();
            }
            else
            {
               // app.UseExceptionHandler("/Home/Error");
            }

            
            app.UseStaticFiles();
            app.UseMvc(routes =>
            routes.MapRoute(
                "api",
                "api/{controller}/{action}")
                .MapRoute(
                 "angular",
                 "{*url}",
                new { controller = "Welcome", action = "Index" })
            );


            
            DbConfiguration.Initialize(context);
        }
    }
}
