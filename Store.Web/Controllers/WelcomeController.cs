using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Store.Web.Controllers
{
    public class WelcomeController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "Welcome";
            return View();
        }
    }
}