using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.BusinessServices.DTOs;
using Store.BusinessServices.Interfaces;
using Store.BusinessServices.Models;
using System.Threading.Tasks;

namespace Store.Web.Controllers
{
    [Produces("application/json")]
    public class AdminController : Controller
    {
        private readonly IHomeService _homeService;
        private readonly IAdminService _adminService;
        private readonly IMenuService _menusService;

        public AdminController(
            IHomeService homeService,
            IAdminService adminService,
            IMenuService menuService

            )
        {
            _adminService = adminService;
            _homeService = homeService;
            _menusService = menuService;

        }

        [HttpPost]
        public IActionResult DeleteMenu(int id)
        {
            if (_adminService.DeleteMenu(id))
            {
                return Ok(new { response = "menu has been successfuly deleted" });
            }
            return BadRequest(new { response = "failed to delete menu" });
        }

        [HttpPost]
        public async Task<ActionResult> SaveMenu(int menuId, string name, IFormFile pdf, IFormFile banner)
        {
            byte[] bannerBytes = null;
            byte[] pdfBytes = null;
            if (banner != null)
            {
                using (var readStream = banner.OpenReadStream())
                {
                    bannerBytes = new byte[banner.Length];
                    await readStream.ReadAsync(bannerBytes, 0, (int)banner.Length);
                }
            }
            if (pdf != null)
            {
                using (var readStream = pdf.OpenReadStream())
                {
                    pdfBytes = new byte[pdf.Length];
                    await readStream.ReadAsync(pdfBytes, 0, (int)pdf.Length);
                }
            }
                var model = new MenuModel()
                {
                    ID = menuId,
                    NAME = name,
                    PDF = pdfBytes,
                    BANNER = bannerBytes
                };


                if (_adminService.SaveMenu(model.ID, model.NAME, model.BANNER, model.PDF))
                    return Ok(new { response = "menu has been updated successfully" });

                return BadRequest(new { response = "failed to update menu" });
            }

        [HttpGet]
        public IActionResult GetMenus(int num, int currentMenu, int currentDish)
        {
            var menus = _menusService.GetMenus(num, currentMenu, currentDish);
            return Json(menus);
        }

        [HttpGet]
        public IActionResult GetMenusBulk(int currentMenu, int currentDish)
        {
            var menus = _menusService.GetMenusBulk(currentMenu, currentDish);
            return Json(menus);
        }

        [HttpGet]
        public IActionResult GetEvents(int num, int current)
        {
            var events = _adminService.GetEvents(num, current);
            return Json(events);
        }

        [HttpPost]
        public async Task<IActionResult> UploadSlide(IFormFile file, int id)
        {
            if (file != null && file.Length > 0)
            {
                var readStream = file.OpenReadStream();
                byte[] image = new byte[file.Length];
                await readStream.ReadAsync(image, 0, (int)file.Length);
                _adminService.SaveSlide(image, id);

                return Ok(new { response = "the image has been successfully updated" });
            }
            return BadRequest(new { response = "the image update failed" });

        }

        [HttpPost]
        public ActionResult SaveEvent([FromBody]EventModel data)
        {
            if (_adminService.SaveEvent(data.ID, data.NAME, data.DESCRIPTION))
                return Ok(new { response = "event has been updated successfully"});

            return Ok(new { response = "failed to save event" });
        }

        [HttpPost]
        public IActionResult DeleteSlide(int id)
        {
            if (_adminService.DeleteSlide(id))
            {
                return Ok(new { response = "the slide has been successfuly deleted" });
            }
             return BadRequest(new { response = "the slide deletion failed" });
        }

        [HttpPost]
        public IActionResult DeleteEventImage(int id)
        {
            if (_adminService.DeleteEventImage(id))
            {
                return Ok(new { response = "event media has been successfuly deleted" });
            }
            return BadRequest(new { response = "failed to delete event media" });
        }

        [HttpPost]
        public IActionResult DeleteEvent(int id)
        {
            if (_adminService.DeleteEvent(id))
            {
                return Ok(new { response = "event has been successfuly deleted" });
            }
            return BadRequest(new { response = "failed to delete event" });
        }

        [HttpPost]
        public async Task<IActionResult> SaveEventImage(int eventId, int mediaId, IFormFile eventImage, string videoUrl)
        {
            if (eventImage != null && eventImage.Length > 0)
            {
                var readStream = eventImage.OpenReadStream();
                byte[] image = new byte[eventImage.Length];
                await readStream.ReadAsync(image, 0, (int)eventImage.Length);
                _adminService.SaveEventMedia(image, eventId, mediaId, null);

                return Ok(new { response = "the event has been successfully updated" });
            }
            else if (!string.IsNullOrEmpty(videoUrl))
            {
                _adminService.SaveEventMedia(null, eventId, mediaId, videoUrl);
                return Ok(new { response = "the event has been successfully updated" });
            }
            return BadRequest(new { response = "the event update failed" });
        }


        [HttpPost]
        public async Task<IActionResult> SaveDish(IFormFile dishImage,int dishId, string name, bool isSpecial, string description, double price, int menuId)
        {
            var model = new DishModel
            {
                dishId = dishId,
                name = name,
                isSpecial = isSpecial,
                description = description,
                price = price,
                menuId = menuId
            };
            if (dishImage != null && dishImage.Length > 0)
            {
                var readStream = dishImage.OpenReadStream();
                byte[] image = new byte[dishImage.Length];
                await readStream.ReadAsync(image, 0, (int)dishImage.Length);
                _adminService.SaveDish(image, model);

                return Ok(new { response = "dish has been successfully updated" });
            }
            return BadRequest(new { response = "dish update failed" });
        }


        [HttpPost]
        public IActionResult DeleteDish(int id)
        {
            if (_adminService.DeleteDish(id))
            {
                return Ok(new { response = "successfully deleted dish" });
            }
            return BadRequest(new { response = "failed to delete dish" });
        }

    }
}
