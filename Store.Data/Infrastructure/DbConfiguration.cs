using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Store.Data.Infrastructure
{
    public static class DbConfiguration
    {
        private const int NUMBER_OF_DAYS_FUTURE = 30;
        public static void Initialize(StoreContext context)
        {
            context.Database.EnsureCreated();
            if (context.BOOKINGS.Any())
            {
                return;//database has been seeded
            }
            //else do something

            DateTime end = DateTime.Now.AddDays(NUMBER_OF_DAYS_FUTURE);
            DateTime start = DateTime.Now;

            var allDates = Enumerable.Range(0, 1 + end.Subtract(start).Days)
               .Select(offset => start.AddDays(offset))
               .Select(p => p.Date.ToString("yyyy-MM-dd"))
               .ToList();

            foreach (var dateStr in allDates)
            {
                var date = Convert.ToDateTime(dateStr);
                context.SLOTS.Add(
                    new TblSlot
                    {
                        CAPACITY = 20,
                        START_TIME = new DateTime(date.Year, date.Month, date.Day, 17, 0, 0),
                        END_TIME = new DateTime(date.Year, date.Month, date.Day, 18, 0, 0),
                        DATE = date
                    });
                context.SLOTS.Add(

                    new TblSlot
                    {
                        CAPACITY = 20,
                        START_TIME = new DateTime(date.Year, date.Month, date.Day, 18, 0, 0),
                        END_TIME = new DateTime(date.Year, date.Month, date.Day, 19, 0, 0),
                        DATE = date
                    });
                context.SLOTS.Add(

                    new TblSlot
                    {
                        CAPACITY = 20,
                        START_TIME = new DateTime(date.Year, date.Month, date.Day, 19, 0, 0),
                        END_TIME = new DateTime(date.Year, date.Month, date.Day, 20, 0, 0),
                        DATE = date
                    });
                context.SLOTS.Add(

                    new TblSlot
                    {
                        CAPACITY = 20,
                        START_TIME = new DateTime(date.Year, date.Month, date.Day, 20, 0, 0),
                        END_TIME = new DateTime(date.Year, date.Month, date.Day, 21, 0, 0),
                        DATE = date
                    });

                context.SLOTS.Add(
                    new TblSlot
                    {
                        CAPACITY = 20,
                        START_TIME = new DateTime(date.Year, date.Month, date.Day, 21, 0, 0),
                        END_TIME = new DateTime(date.Year, date.Month, date.Day, 22, 0, 0),
                        DATE = date
                    });
            }
            context.Commit();
        }
    }
}
