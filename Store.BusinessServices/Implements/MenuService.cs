using Store.BusinessServices.Interfaces;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System;
using Store.BusinessServices.DTOs;

namespace Store.BusinessServices.Implements
{
    public class MenuService : IMenuService
    {
        private readonly IBaseRepository<TblMenu> _menusRepo;
        private readonly IBaseRepository<TblError> _errorsRepo;


        public MenuService(
            IBaseRepository<TblMenu> menusRepo,
            IBaseRepository<TblError> errorsRepo)
        {
            _menusRepo = menusRepo;
            _errorsRepo = errorsRepo;

        }




        public List<MenuModel> GetMenus(int num, int currentMenu, int currentDish)
        {
            try
            {
                var menus = _menusRepo
                    .GetNumOfItemsWithParams("ITEMS", 1, currentMenu);

                List<MenuModel> menuModels = new List<MenuModel>();
                for (int j = 0; j < menus.Count(); j++)
                {
                    List<TblDish> items = new List<TblDish>();
                    for (int i = currentDish; i < (currentDish + num) && i < menus.ElementAt(j).ITEMS.Count; i++)
                    {
                        items.Add(new TblDish
                        {
                            ID = menus.ElementAt(j).ITEMS.ElementAt(i).ID,
                            IMAGE = menus.ElementAt(j).ITEMS.ElementAt(i).IMAGE,
                            DESCRIPTION = menus.ElementAt(j).ITEMS.ElementAt(i).DESCRIPTION,
                            NAME = menus.ElementAt(j).ITEMS.ElementAt(i).NAME,
                            IS_SPECIAL = menus.ElementAt(j).ITEMS.ElementAt(i).IS_SPECIAL,
                            PRICE = menus.ElementAt(j).ITEMS.ElementAt(i).PRICE,
                            MENU_ID = menus.ElementAt(j).ITEMS.ElementAt(i).MENU_ID
                        });
                    }


                    var menuModel = new MenuModel
                    {
                        ID = menus.ElementAt(j).ID,
                        PDF = menus.ElementAt(j).PDF,
                        BANNER = menus.ElementAt(j).BANNER,
                        NAME = menus.ElementAt(j).NAME,
                        ITEMS = items
                    };
                    menuModels.Add(menuModel);
                }
                return menuModels;

            }
            catch (Exception exc)
            {
                _errorsRepo.Add(new TblError
                {
                    Message = exc.Message,
                    StackTrace = exc.StackTrace
                });
                return null;
            }

        }

        public List<MenuModel> GetMenusBulk(int currentMenu, int currentDish)
        {
            try
            {
                var menus = _menusRepo
                    .GetNumOfItemsWithInclude("ITEMS")
                    .OrderByDescending(p => p.NAME)
                    .Take(currentMenu)
                    .ToList();

                var items = GetMenus(default(int), menus);

                var lastRow = _menusRepo
                    .GetNumOfItemsWithInclude("ITEMS")
                    .OrderByDescending(p => p.NAME)
                    .Skip(currentMenu)
                    .Take(1)
                    .ToList();

                var lastRowItems = GetMenus(currentDish, lastRow);
                items.AddRange(lastRowItems);
                    return items;
            }
            catch (Exception exc)
            {
                return null;
            }

        }


        public List<MenuModel> GetMenus(int number, List<TblMenu> menus)
        {
         return menus.Select(p => new MenuModel
            {
                ID = p.ID,
                PDF = p.PDF,
                BANNER = p.BANNER,
                NAME = p.NAME,
                ITEMS = p.ITEMS
                    .Take(number == default(int) ?  p.ITEMS.Count : number)
                    .Select(d => new
                    TblDish
                    {
                        ID = d.ID,
                        IMAGE = d.IMAGE,
                        DESCRIPTION = d.DESCRIPTION,
                        NAME = d.NAME,
                        IS_SPECIAL = d.IS_SPECIAL,
                        PRICE = d.PRICE,
                        MENU_ID = d.MENU_ID
                    })
                   .ToList()
            })
                .ToList();
        }
    }
}
