using Store.BusinessServices.DTOs;
using Store.Data.DataEntities;
using System.Collections.Generic;

namespace Store.BusinessServices.Interfaces
{
    public interface IWhatsonService
    {
        List<EventModel> GetEvents(int num, int current);
        void SaveEvent(byte[] image, int id, string name, string url, string description);

    }
}
