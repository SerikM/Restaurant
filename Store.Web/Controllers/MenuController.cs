using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.BusinessServices.Implements;
using Store.BusinessServices.Interfaces;

namespace Store.Web.Controllers
{
    [Produces("application/json")]
    public class MenuController : Controller
    {
        private IMenuService _menuService;
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public IActionResult GetMenus(int num, int currentMenu, int currentDish)
        {
            var menus = _menuService.GetMenus(num, currentMenu, currentDish);
            return Json(menus);
        }


    }
}