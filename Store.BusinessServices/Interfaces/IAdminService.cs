using Store.BusinessServices.DTOs;
using Store.BusinessServices.Models;
using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Store.BusinessServices.Interfaces
{
    public interface IAdminService
    {
        void SaveDish(byte[] image, DishModel model);
        List<EventModel> GetEvents(int num, int current);
        void SaveEventMedia(byte[] image, int eventId, int mediaId, string eventVideoUrl);

        bool SaveEvent(int eventId, string name, string description);
        void SaveSlide(byte[] image, int id);
        bool DeleteSlide(int id);
        bool DeleteEventImage(int id);
        bool DeleteEvent(int id);
        bool DeleteMenu(int id);
        bool DeleteDish(int id);

        bool SaveMenu(int menuId, string name, byte[] banner, byte[] pdf);

    }
}
