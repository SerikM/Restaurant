using Microsoft.AspNetCore.Mvc;
using Store.BusinessServices.Interfaces;

namespace Store.Web.Controllers
{
    [Produces("application/json")]
    public class HomeController : Controller
    {
        private readonly IHomeService _homeService;

        public HomeController(IHomeService homeService)
        {
            _homeService = homeService;
        }

        public IActionResult GetSlides()
        {
            var slides = _homeService.GetSlides();
            return Json(slides);
        }
    }
}
