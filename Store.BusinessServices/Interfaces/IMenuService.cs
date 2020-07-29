using Store.BusinessServices.DTOs;
using Store.Data.DataEntities;
using System.Collections.Generic;

namespace Store.BusinessServices.Interfaces
{
    public interface IMenuService
    {
        List<MenuModel> GetMenus(int num, int currentMenu, int currentDish);
        List<MenuModel> GetMenusBulk(int currentMenu, int currentDish);
    }
}
