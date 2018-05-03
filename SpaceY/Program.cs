using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace SpaceY
{
    /// <summary>
    /// Entry point for application
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Starts the server.
        /// </summary>
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        /// <summary>
        /// Configures Asp.Net WebHost.
        /// </summary>
        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
