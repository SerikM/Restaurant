using Store.BusinessServices.DTOs;
using Store.BusinessServices.Interfaces;
using Store.BusinessServices.Models;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Store.BusinessServices.Implements
{
    public class AdminService : IAdminService
    {
        private readonly IBaseRepository<TblEvent> _eventsRepo;
        private readonly IBaseRepository<TblMedia> _mediaRepo;
        private readonly IBaseRepository<TblSlide> _slidesRepo;
        private readonly IBaseRepository<TblMenu> _menusRepo;
        private readonly IBaseRepository<TblDish> _dishRepo;


        public AdminService(
            IBaseRepository<TblEvent> eventsRepo,
            IBaseRepository<TblMedia> mediaRepo,
            IBaseRepository<TblSlide> slidesRepo,
            IBaseRepository<TblMenu> menusRepo,
            IBaseRepository<TblDish> dishRepo
            )
        {
            _eventsRepo = eventsRepo;
            _slidesRepo = slidesRepo;
            _mediaRepo = mediaRepo;
            _menusRepo = menusRepo;
            _dishRepo = dishRepo;

        }

        public void SaveDish(byte[] image, DishModel model)
        {
            var entity = _dishRepo.GetSingle(model.dishId);
            if (entity == null)
            {
                _dishRepo.Add(new TblDish
                {
                    MENU_ID = model.menuId,
                    IMAGE = image,
                    DESCRIPTION = model.description,
                    IS_SPECIAL = model.isSpecial,
                    NAME = model.name,
                    PRICE = model.price
                });
            }
            else
            {
                entity.IMAGE = image;
                entity.DESCRIPTION = model.description;
                entity.IS_SPECIAL = model.isSpecial;
                entity.NAME = model.name;
                entity.PRICE = model.price;
                _dishRepo.Edit(entity);
            }
            _dishRepo.Commit();
        }

        public bool SaveMenu(int menuId, string name, byte[] banner, byte[] pdf)
        {
            var entity = _menusRepo.GetSingle(menuId);
            if (entity == null)
            {
                _menusRepo.Add(new TblMenu
                {
                    NAME = name,
                    BANNER = banner,
                    PDF = pdf
                });
            }
            else
            {
                entity.NAME = name;
                if (banner != null)
                {
                    entity.BANNER = banner;
                }
                entity.BANNER = banner;
                if (pdf != null)
                {
                    entity.PDF = pdf;
                }
                _menusRepo.Edit(entity);
            }
            return _menusRepo.Commit();
        }

        public bool SaveEvent(int eventId, string name, string description)
        {
           var entity = _eventsRepo.GetSingle(eventId);
            if (entity == null)
            {
                _eventsRepo.Add(new TblEvent
                {
                    DESCRIPTION = description,
                    NAME = name,
                    DATE = DateTime.Now
                });
            }
            else
            {
                entity.NAME = name;
                entity.DESCRIPTION = description;
                _eventsRepo.Edit(entity);
            }
           return _eventsRepo.Commit();
          
        }

        public List<EventModel> GetEvents(int num, int current)
        {
            try
            {
                var events = _eventsRepo.GetNumOfItemsWithInclude("MEDIAS")
                    .OrderByDescending(p => p.DATE)
                    .Skip(current)
                    .Take(num)
                    .ToList();
                return events.Select(p => new EventModel
                {
                    ID = p.ID,
                    NAME = p.NAME,
                    DESCRIPTION = p.DESCRIPTION,
                    MEDIAS = p.MEDIAS.Select(d => new
                    TblMedia
                    {
                        ID = d.ID,
                        IMAGE = d.IMAGE,
                        URL = d.URL
                   })
                   .ToList()
                })
                .ToList();
            }
            catch (Exception exc)
            {
                return null;
            }
        }
        
        public void SaveEventMedia(byte[] image, int eventId, int mediaId, string eventVideoUrl)
        {
            var entity = _mediaRepo.GetSingle(mediaId);
            if (entity == null)
            {
                _mediaRepo.Add(new TblMedia
                {
                    EVENT_ID = eventId,
                    IMAGE = image,
                    URL = eventVideoUrl
                });
            }
            else
            {
                entity.IMAGE = image;
                entity.URL = eventVideoUrl;
                _mediaRepo.Edit(entity);
            }
            _mediaRepo.Commit();
        }
        public void SaveSlide(byte[] image, int id)
        {

            var entity = _slidesRepo.GetSingle(id);
            if (entity == null)
            {
                _slidesRepo.Add(new TblSlide { IMAGE = image });
            }
            else
            {
                entity.IMAGE = image;
                _slidesRepo.Edit(entity);
            }
            _slidesRepo.Commit();
        }

        public bool DeleteSlide(int id)
        {
          var slideToDelete = _slidesRepo.GetSingle(id);
            if (slideToDelete == null) return false;
            _slidesRepo.Delete(slideToDelete);
            return _slidesRepo.Commit();
        }
        public bool DeleteEventImage(int id)
        {
            var mediaToDelete = _mediaRepo.GetSingle(id);
            if (mediaToDelete == null) return false;
            _mediaRepo.Delete(mediaToDelete);
            return _mediaRepo.Commit();
        }
        public bool DeleteEvent(int id)
        {
            var eventToDelete = _eventsRepo.GetSingle(id);
            if (eventToDelete == null) return false;
            _eventsRepo.Delete(eventToDelete);
            return _eventsRepo.Commit();
        }
        public bool DeleteDish(int id)
        {
            var dish= _dishRepo.GetSingle(id);
            if (dish == null) return false;

            _dishRepo.Delete(dish);
            return _dishRepo.Commit();
        }


        public bool DeleteMenu(int id)
        {
            var menu = _menusRepo.GetSingle(id);
            if (menu == null) return false;
            _menusRepo.Delete(menu);
            return _menusRepo.Commit();
        }



    }
}
