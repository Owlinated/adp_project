using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SpaceY.Controllers
{
    /// <summary>
    /// Controller responsible for rendering views.
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Displays single page application.
        /// </summary>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Displays error view.
        /// </summary>
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
