using Store.BusinessServices.DTOs;
using Store.Data.DataEntities;
using System.Collections.Generic;

namespace Store.BusinessServices.Interfaces
{
    public interface IBookingService
    {
        List<string> GetAvailableDates();
        List<ReserveModel> GetAvailableHours(string selectedDate);
        bool Reserve(ReserveModel model);

    }
}
