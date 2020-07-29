using Store.BusinessServices.Interfaces;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Store.BusinessServices.Implements
{
    public class HomeService : IHomeService
    {
        private readonly IBaseRepository<TblSlide> _slidesRepo;

        public HomeService(IBaseRepository<TblSlide> slidesRepo)
        {
            _slidesRepo = slidesRepo;
        }

        public List<TblSlide> GetSlides()
        {
            try
            {
                return _slidesRepo.GetAll().ToList();
            }
            catch (Exception exc)
            {
                return null;
            }
        }
    } }
