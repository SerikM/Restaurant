using Store.Data.DataEntities;
using System.Collections.Generic;

namespace Store.BusinessServices.Interfaces
{
    public interface IHomeService
    {
        List<TblSlide> GetSlides();
    }
}
