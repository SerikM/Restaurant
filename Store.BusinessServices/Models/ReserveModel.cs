using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Store.BusinessServices.DTOs
{
    public class ReserveModel
    {
        public string selectedDate { get; set; }
        public string selectedHour { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public int quantity { get; set; }
        public string emailMessage { get; set; }
        public string emailSubject { get; set; }
        public int capacity { get; set; }

    }
}










